import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification, 
    Trainer, 
    TrainingArguments,
    DataCollatorWithPadding
)
from datasets import Dataset

# wandb.ai api-key = 3535eb4789c72bc4360367a237e08d6b12bbeaa2

MODEL_NAME = "klue/bert-base"
DATA_FILE = "movie_emotions_train_final.csv"
OUTPUT_DIR = "C:\\Users\\deukr\\Feelm-AI"

df = pd.read_csv(DATA_FILE)

label_map = {
    '기쁨': 0, 
    '슬픔': 1, 
    '설렘': 2,
    '공포': 3,
    '외로움': 4
}


df['labels'] = df['label'].map(label_map)

df = df.drop(columns=['label'])
df = df.dropna(subset=['labels'])
df['lables'] = df['labels'].astype(int)

train_df, val_df = train_test_split(df, test_size=0.1, random_state=42, stratify=df['labels'])

dataset_train = Dataset.from_pandas(train_df)
dataset_val = Dataset.from_pandas(val_df)

if "__index_level_0__" in dataset_train.column_names:
    dataset_train = dataset_train.remove_columns(["__index_level_0__"])
if "__index_level_0__" in dataset_val.column_names:
    dataset_val = dataset_val.remove_columns(["__index_level_0__"])

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def tokenize_function(examples):
    return tokenizer(examples['plot'], truncation=True, padding=False, max_length=128)

tokenized_train = dataset_train.map(tokenize_function, batched=True)
tokenized_val = dataset_val.map(tokenize_function, batched=True)

data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

id2label = {v: k for k, v in label_map.items()}


model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME, 
    num_labels=5,
    id2label=id2label,
    label2id=label_map
)

training_args = TrainingArguments(
    output_dir="./results",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    save_total_limit=1,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val,
    tokenizer=tokenizer,
    data_collator=data_collator,
)

print("학습 시작...")
trainer.train()

print("모델 저장 중...")
trainer.save_model(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR) 
print(f"모델이 {OUTPUT_DIR}에 저장되었습니다.")