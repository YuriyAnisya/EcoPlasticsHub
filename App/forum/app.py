from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

DATABASE = "forum.db"  # Path to your SQLite database file


def query_db(query, args=(), one=False):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute(query, args)
        conn.commit()
        result = cursor.fetchall()
        return (result[0] if result else None) if one else result


@app.route("/questions", methods=["GET", "POST"])
def manage_questions():
    if request.method == "GET":  # Fetch all questions
        questions = query_db(
            "SELECT id, title, content, timestamp FROM questions ORDER BY timestamp DESC"
        )
        return jsonify(questions)  # Return as JSON

    elif request.method == "POST":  # Add a new question
        data = request.json
        query_db(
            "INSERT INTO questions (title, content) VALUES (?, ?)",
            (data["title"], data["content"]),
        )
        return jsonify({"message": "Question added successfully!"})


@app.route("/replies/<int:question_id>", methods=["GET", "POST"])
def manage_replies(question_id):
    if request.method == "GET":  # Fetch all replies for a question
        replies = query_db(
            "SELECT id, content, timestamp FROM replies WHERE question_id = ? ORDER BY timestamp ASC",
            (question_id,),
        )
        return jsonify(replies)  # Return as JSON

    elif request.method == "POST":  # Add a reply to a question
        data = request.json
        query_db(
            "INSERT INTO replies (question_id, content) VALUES (?, ?)",
            (question_id, data["content"]),
        )
        return jsonify({"message": "Reply added successfully!"})


@app.route("/questions/<int:question_id>", methods=["DELETE"])
def delete_question(question_id):
    # Delete the question
    query_db("DELETE FROM questions WHERE id = ?", (question_id,))
    # Also delete all related replies
    query_db("DELETE FROM replies WHERE question_id = ?", (question_id,))
    return jsonify({"message": "Question deleted successfully!"})


@app.route("/replies/<int:reply_id>", methods=["DELETE"])
def delete_reply(reply_id):
    query_db("DELETE FROM replies WHERE id = ?", (reply_id,))
    return jsonify({"message": "Reply deleted successfully!"})


if __name__ == "__main__":
    app.run(debug=True)
