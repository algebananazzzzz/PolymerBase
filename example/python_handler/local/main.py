def main(event, context):
    print(event)
    return {
        "response": 200,
        "body": "Hello world"
    }


if __name__ == "__main__":
    main({"body": "Hello world"})
