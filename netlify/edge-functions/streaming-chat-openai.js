


export default async (Request) => {
  const text = await Request.text();
  const text_json = JSON.parse(text);
  console.log(JSON.stringify(text_json));
  const userMessage = text_json["message"] || "hello";
  const streamType = JSON.parse(text_json["stream"])

  const API_URL = "https://api.openai.com/v1/chat/completions";
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  const bodyParams = {
    model: "gpt-3.5-turbo",
    //prompt: userMessage,
    messages: [
      {
          "role": "user",
          "content": userMessage
      }
    ],
    max_tokens: 512,
    temperature: 0.2,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: streamType
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(bodyParams)
  };
  console.log("calling OpenAI API: " + JSON.stringify(bodyParams));
  try {
    const res = await fetch(API_URL, requestOptions);
  
    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`OpenAI API Error: ${res.status} ${res.statusText} - ${errorMessage}`);
      throw new Error(`OpenAI API Error: ${res.status} ${res.statusText}`);
    }
  
  console.log("Response back from OpenAI");
  console.log(res.status);
  console.log(res.statusText);
  console.log(res);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: { "Content-Type": "text/plain" },
  });
  } catch (error) {
    console.error('Error while processing request:', error);
    return new Response(error.message || 'Internal server error', { status: 500 });
  }  
};