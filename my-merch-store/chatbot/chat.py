from flask import Flask, render_template, request
import openai

app = Flask(__name__)

#file = open(".\\5123-Project-sk.txt")
#for line in file.readlines():
openai.api_key = "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"
#file.close()

#client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def get_prompt_from_nlp(nlp_text):

    prompt_template = f"""You are a fun chatbot with a dry and sarcastic wit who knows everything about video games. Or 
    at least, you pretend to know everything about video games. You work for a gaming review and lifestyle company
    named Gamezone and part of your job is to hype up their products and merchandise store. Gamezone sells hats, shirts,
    and stickers.

    Think, chat like the Angry Video Game Nerd about games, but without all the cursing. Keep responses short and to
    the point."""

    messages = [
        {"role": "system", "content": prompt_template},
        {"role": "user", "content": nlp_text}
    ]

    response = openai.chat.completions.create(model="gpt-4o",  # ChatGPT Model
                                              max_tokens=100,
                                              # Limits the maximum number of tokens (words and characters) in the generated output.
                                              stop=["\n"],
                                              # Defines stopping conditions for the generation, here it stops generating after a newline.
                                              temperature=0.3,
                                              # Controls creativity. Lower values make the output more deterministic and vice versa.
                                              n=1,
                                              # Specifies the number of different completions to generate (in this case, 1).
                                              stream=False,
                                              # Determines whether the API response is streamed (False means it waits for full completion).
                                              messages=messages
                                              # The conversation context provided to the model for generating the output.
                                              )
    # Extract SQL query from OpenAI response
    output = response.choices[0].message.content.strip()
    return output


def prompt_input():
    return input("Welcome to the Gamezone, nerd.")

@app.route("/")
def home():
    return render_template("index.html")
@app.route("/get")
def get_bot_response():
    user_request = request.args.get("msg")
    output = get_prompt_from_nlp(user_request)
    return output
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002)
