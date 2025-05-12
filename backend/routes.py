from llm import llm_prompt
from utils import clean_input, format_response

def main():
    user_input = input("Ask HR Expert: ")
    llm_reply = llm_prompt(user_input)  # don't overwrite the function name!
    print("\nExpert says:\n", llm_reply)

if __name__ == "__main__":
    main()