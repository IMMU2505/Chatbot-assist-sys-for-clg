from flask import Flask, request, jsonify


text_clean = clean_text(text)
x = vectorizer.transform([text_clean])


# Get probabilities
probs = clf.predict_proba(x)[0]
pred_idx = int(np.argmax(probs))
pred_tag = le.inverse_transform([pred_idx])[0]
confidence = float(probs[pred_idx])


# If low confidence, try rule-based matcher as fallback
if confidence < 0.6:
rule_tag, rule_conf = rule_match(text, intents)
if rule_tag and rule_conf > confidence:
pred_tag = rule_tag
confidence = rule_conf


response = choose_response(pred_tag, intents)


return jsonify({'intent': pred_tag, 'confidence': confidence, 'response': response})




@app.route('/health', methods=['GET'])
def health():
return jsonify({'status': 'ok'})




if __name__ == '__main__':
app.run(host='0.0.0.0', port=5000, debug=True)

