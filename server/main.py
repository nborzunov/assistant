from fastapi import FastAPI, Request
import re
import unicodedata
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
from string import punctuation
from bs4 import BeautifulSoup
import requests
import spacy
import ru_core_news_sm
import data

nlp = ru_core_news_sm.load()

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_string(string):
    # Normalize the string to remove any accents or diacritical marks
    normalized_string = unicodedata.normalize('NFKD', string)
    # Use the re.sub() function to replace all non-letter and non-number characters with an empty string
    cleaned_string = re.sub(r'[^\w\s\d]', '', normalized_string)
    return cleaned_string


def get_subject_phrase(doc):
    for token in doc:
        if "obj" in token.dep_:
            subtree = list(token.subtree)
            start = subtree[0].i
            end = subtree[-1].i + 1
            return doc[start:end]


def get_object_phrase(doc):
    for token in doc:
        if "dobj" in token.dep_:
            subtree = list(token.subtree)
            start = subtree[0].i
            end = subtree[-1].i + 1
            return doc[start:end]


def get_hotwords(text):
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN']
    doc = nlp(text.lower())
    for token in doc:
        if token.text in nlp.Defaults.stop_words or token.text in punctuation:
            continue
        if token.pos_ in pos_tag:
            result.append(token.lemma_)
    return result



def get_most_common(text: str):
    doc = nlp(text.lower())
    output = []
    for token in doc:
        if token.pos_ in ['NOUN', 'VERB', 'ADJ'] or token.dep_ in ['nsubj', 'dobj']:
            output.append(token.lemma_)
    return [key[0] for key in Counter(output).most_common(10)]


def is_question(doc):
    has_question = False
    for token in doc:
        if token.text == '?' or token.text == '«?' or token.text == '?»':
            has_question = True
        elif token.dep_ == "aux" and token.head.pos_ == "VERB":
            print('87')
            has_question = True
        elif token.dep_ == "auxpass" and token.head.pos_ == "VERB":
            print('90')
            has_question = True
        elif token.dep_ == "nsubj" and token.head.pos_ == "AUX":
            print('93')
            has_question = True
    if doc[-1].text == '?' or doc[0].lemma_ in ('кто', 'что', 'где', 'когда', 'почему', 'зачем', 'как'):
        print('100')
        has_question = True
    if any(token.tag_ == 'INTJ' and token.text.lower() in ('ой', 'ай', 'увы', 'ага') for token in doc):
        print('102')
        has_question = True
    if any(token.tag_ == 'VERB' and 'Mood=Imp' in token.morph for token in doc):
        print('105')
        has_question = True
    return has_question

# Приводим ответы из разных источников к единому виду, рассчитываем ключевые слова
# В нормальном коде это конечно же будет в БД


pattern = r"^\d+\.\s"
soup = BeautifulSoup(data.faq, 'html.parser')
questions = []
for question in soup.find_all('div', class_='question'):
    heading = re.sub(pattern, "", question.find('a', class_='question__header').text.strip(), flags=re.MULTILINE)
    text = [ re.sub(pattern, "", p.text.strip(), flags=re.MULTILINE)for p in question.select("div[class*=question__content]")[0].find_all('p')]
    keywords = get_most_common(heading + ' ' + " ".join(text))
    questions.append({'heading': heading, 'text': text, 'keywords': keywords})

soup = BeautifulSoup(data.questions, 'html.parser')
for question in soup.select("div[class*=accordion_item]"):
    heading = re.sub(pattern, "", question.select("span[class*=accordion_title]")[0].text.strip(), flags=re.MULTILINE)
    text = [ re.sub(pattern, "", p.text.strip(), flags=re.MULTILINE)for p in question.select("div[class*=accordion_answer]")[0].find_all('p')]
    keywords = get_most_common(heading + ' ' + " ".join(text))
    questions.append({'heading': heading, 'text': text, 'keywords': keywords})

for question in data.support_questions:

    keywords = get_most_common(question["heading"] + ' ' + question["text"][0])
    questions.append({'heading': question["heading"], 'text': question["text"], 'keywords': keywords})


for question in questions:
    print(question['heading'])
@app.post("/translate/")
async def root(info: Request):
    res = await info.json()
    text = res['text']

    doc = nlp(text)

    if is_question(doc) or res['isQuestion']:
        request_keywords = []
        for token in doc:
            if token.pos_ in ['NOUN', 'VERB', 'ADJ'] or token.dep_ in ['nsubj', 'dobj']:
                request_keywords.append(token.lemma_)

        most_proper_answer = None
        max_score = 0
        for obj in questions:
            score = len(set(obj['keywords']) & set(request_keywords))
            if score > max_score:
                max_score = score
                most_proper_answer = obj
        if not most_proper_answer:
            return {
                "text": text,
                "isQuestion": True,
                "answerHeading": "Попробуйте сформулировать вопрос иначе",
            }
        return {
            "text": text,
            "isQuestion": True,
            "answerHeading": most_proper_answer['heading'],
            "answerText": most_proper_answer['text'],
        }
    return {
        "text": text,
        "isQuestion": False
    }
