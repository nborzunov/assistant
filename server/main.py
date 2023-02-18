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
        if ("obj" in token.dep_):
            subtree = list(token.subtree)
            start = subtree[0].i
            end = subtree[-1].i + 1
            return doc[start:end]


def get_object_phrase(doc):
    for token in doc:
        if ("dobj" in token.dep_):
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

soup = BeautifulSoup(data.faq, 'html.parser')
questions = []

def get_most_common(text: str):
    doc = nlp(text.lower())
    normalized_text = " ".join([token.lemma_ for token in doc])
    output = set(get_hotwords(normalized_text))
    return [key[0] for key in Counter(output).most_common(10)]

for question in soup.find_all('div', class_='question'):
    heading = question.find('a', class_='question__header').text.strip()
    text = ' '.join([p.text.strip() for p in question.find('div', class_='question__content').find_all('p')])

    keywords = get_most_common(heading + ' ' + text)
    questions.append({'heading': heading, 'text': text, 'keywords': keywords})


@app.post("/translate/")
async def root(info: Request):
    text = await info.json()
    doc = nlp(text)

    isQuestion = False
    for token in doc:
        print(token.text, token.dep_, token.head.text, token.head.pos_,
              [child for child in token.children])

        if token.head.pos_ == "CCONJ" or token.head.pos_ == 'ADV' or token.head.pos_ == 'PRON':
            isQuestion = True

    subject_phrase = get_subject_phrase(doc)
    object_phrase = get_object_phrase(doc)
    print(subject_phrase)
    print(object_phrase)

    output = set(get_hotwords(text))
    request_keywords = [key[0] for key in Counter(output).most_common(10)]
    print(request_keywords)

    results = []
    for i, obj in enumerate(questions):
        intersection = set(obj['keywords']).intersection(set(request_keywords))
        results.append((len(intersection), i))

    results.sort(reverse=True)

    most_proper_answer = questions[results[0][1]]
    print(most_proper_answer)
    return {
        "text": text,
        "isQuestion": isQuestion
    }
