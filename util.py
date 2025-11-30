import json
tokens = nltk.word_tokenize(text)
tokens = [stemmer.stem(t) for t in tokens]
return " ".join(tokens)




def build_corpus_and_labels(intents: dict) -> Tuple[List[str], List[str]]:
corpus = []
labels = []
for intent in intents['intents']:
tag = intent['tag']
for pattern in intent.get('patterns', []):
corpus.append(clean_text(pattern))
labels.append(tag)
return corpus, labels




# A simple rule matcher: look for keywords from patterns
def rule_match(text: str, intents: dict) -> Tuple[str, float]:
text_clean = text.lower()
best_tag = None
best_score = 0
for intent in intents['intents']:
tag = intent['tag']
for pattern in intent.get('patterns', []):
p = pattern.lower()
if p in text_clean:
# exact phrase match -> high confidence
return tag, 0.95
# otherwise count common words
p_words = set(re.findall(r"\w+", p))
t_words = set(re.findall(r"\w+", text_clean))
common = len(p_words & t_words)
if common > 0:
score = common / (len(p_words) + 1)
if score > best_score:
best_score = score
best_tag = tag
if best_tag:
return best_tag, min(0.8, best_score)
return None, 0.0




def choose_response(tag: str, intents: dict) -> str:
for intent in intents['intents']:
if intent['tag'] == tag:
return random.choice(intent.get('responses', ["Sorry, I don't have an answer for that."]))
return "Sorry, I don't have an answer for that."

