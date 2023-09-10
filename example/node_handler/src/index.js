async function main(event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    return {
        response: 200,
        body: "Response OK"
    };
};

if (require.main === module) {
    main({ body: "Hello World" })
}