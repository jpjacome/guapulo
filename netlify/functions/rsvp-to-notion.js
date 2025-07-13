const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: 'Invalid JSON',
    };
  }

  // Extract RSVP fields
  const { name, email, phone, plus_one, guest_name, message } = data;

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name': { title: [{ text: { content: name || '' } }] },
        'Email': { email: email || '' },
        'Phone': { rich_text: [{ text: { content: phone || '' } }] },
        'Plus One': { select: { name: plus_one || 'No' } },
        'Guest Name': { rich_text: [{ text: { content: guest_name || '' } }] },
        'Message': { rich_text: [{ text: { content: message || '' } }] },
        'Timestamp': { date: { start: new Date().toISOString() } },
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
