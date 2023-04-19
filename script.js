/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// console.log() is a great debugging tool!
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Welcome to the Workshop!");

// Secret not secret key: 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
// Key will be disabled 4/28/23
// Get references to HTML elements
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');

// Listen for form submission
messageForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the user's message
    const userMessage = messageInput.value.trim();
    
    // If the user's message is empty, do nothing
    if (!userMessage) return;
    
    // Add the user's message to the messages container
    messages.innerHTML += `<div class="message user-message">${userMessage}</div>`;
    
    // Clear the input field
    messageInput.value = '';

    // Get the bot's response and image
    const [botMessage, imageURL] = await Promise.all([
      getBotResponse(userMessage),
      getImageForBotResponse(userMessage),
    ]);

    // Add the bot's message and image to the messages container
    messages.innerHTML += `<div class="message bot-message">${botMessage}</div>`;
    messages.innerHTML += `<img class="bot-image" src="${imageURL}" alt="Generated image"/>`;
    
    // Scroll to the bottom of the messages container
    messages.scrollTop = messages.scrollHeight;
});

// Function to get the bot's response using the GPT API
async function getBotResponse(message) {
    // Replace with your actual API key
    const apiKey = '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';

    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are the chatbot acting as the dean of a business school in the new virtual reality, called MIVT. You provide answers about the rules and upcoming classes in the school."
            },
            {
              role: "user",
              content: "What classes can I sign up for this semester?"
            },
            {
              role: "system",
              content: "We have a new class called 'Pricing for Holograms' in the skydeck, I think you'll really like it."
            },
            {
                role: "user",
                content: message
            }
        ],
        //temperature can be between 0 (straightforward) and 1 (very chaotic)
        temperature: 0.3,
        max_tokens: 2000
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (response.ok) {
        const jsonResponse = await response.json();
        const botMessage = jsonResponse.choices[0].message.content;
        return botMessage;
    } else {
        console.error('Error fetching GPT API response:', response);
        return 'An error occurred. Please try again.';
    }
}

// Function to get an image URL based on the bot's response using the DALL-E API
async function getImageForBotResponse(botMessage) {
  const apiKey = "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";
  const prompt = botMessage + " in the style of a virtual reality game";
  const apiUrl = "https://api.openai.com/v1/images/generations";
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  });

  const requestBody = {
    model: "image-alpha-001",
    prompt,
    num_images: 1,
    size: "256x256",
    response_format: "url",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      const imageURL = jsonResponse.data[0].url;
      return imageURL;
    } else {
      console.error("Error fetching DALL-E API response:", response.statusText);
      return "https://via.placeholder.com/256x256?text=Error+Generating+Image";
    }
  } catch (error) {
    console.error("Error fetching DALL-E API response:", error);
    return "https://via.placeholder.com/256x256?text=Error+Generating+Image";
  }
}