def lambda_handler(event, context):
    print(event)
    return {
        "response": 200,
        "body": "Hello world"
    }
