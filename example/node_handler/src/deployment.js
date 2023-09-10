exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    return {
        response: 200,
        body: "Response OK"
    };
};