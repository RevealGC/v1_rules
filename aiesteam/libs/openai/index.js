const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey:  process.env.OPENAI_API_KEY|| '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',
});
const openai = new OpenAIApi(configuration);



let defaultParseString = "Express this : Rule PAY_ANN_RULE: Annual Pay of MD is less than that of VA: If agg(\"PAY_ANN\", \"state='MD'\") < agg(\"PAY_ANN\", \"state='VA'\")  then send a message: Annual Pay of MD is less than that of VA and track these facts: [\"PAY_ANN\"]. Also perform the following actions:[]. This rule is of type: validation.  It has a rule priority of 5 on a scale of 1-10.No api has been defined."


module.exports ={

 async  aicomplete(str = defaultParseString) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: str,
        temperature: 0.5,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    let result = response.data.choices[0]['text']
    console.log(result);
    return result;
}
}

// testAi();


