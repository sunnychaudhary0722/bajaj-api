const express = require('express');
const fileType = require('file-type');  // Import the 'file-type' library
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Increase the body size limit if needed

async function validateFile(base64File) {
    if (!base64File) {
        return { file_valid: false, file_mime_type: null, file_size_kb: null };
    }

    const fileBuffer = Buffer.from(base64File, 'base64');

    const fileSizeKb = fileBuffer.length / 1024;
    ``
    const fileInfo = await fileType.fromBuffer(fileBuffer);
    if (!fileInfo) {
        return { file_valid: false, file_mime_type: null, file_size_kb: fileSizeKb.toFixed(2) };
    }

    // Allow only specific file types (e.g., JPEG, PNG, PDF)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const isValid = allowedMimeTypes.includes(fileInfo.mime);

    return {
        file_valid: isValid,
        file_mime_type: fileInfo.mime,
        file_size_kb: fileSizeKb.toFixed(2),  // Return size in KB, rounded to 2 decimal places
    };
}

app.post('/bhfl', async function (req, res) {
    const { data, fileBase64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Data should be an array.' });
    }

    // Filter numbers and alphabets from the data
    const numbers = data.filter(item => /^[0-9]+$/.test(item));
    const alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));

    // Filter for lowercase alphabets
    const lowercaseAlphabets = alphabets.filter(item => /^[a-z]+$/.test(item));

    // Find the last character in alphabetical order
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0
        ? lowercaseAlphabets.sort().pop() // Sort and get the last character
        : null;

    console.log('Numbers:', numbers);
    console.log('Alphabets:', alphabets);
    console.log('Highest Lowercase Alphabet:', highestLowercaseAlphabet);
    const fileResult = await validateFile(fileBase64);
    return res.json({
        is_success: true,
        user_id: "sunny_chaudhary_08112002",
        roll_number: "RA2111031010124",
        numbers,
        alphabets,
        highest_lowercase_alphabet: [highestLowercaseAlphabet], // Character in last position
        fileResult
    });
});
app.get('/bhfl', async (req, res) => {
    res.status(200).json({ operation_code: 1 })
}
)

app.listen(3000, () => {
    console.log('Server is running on port 3000');  // Correctly logging the port number
});
