// Native fetch is available in Node 18+

const testRegistration = async () => {
    const email = `test.dev.${Date.now()}@gmail.com`;
    const password = 'password123';
    const name = 'Test Dev';

    console.log(`Testing Registration with: ${email}`);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        console.log(`Status: ${response.status}`);
        console.log('Response:', data);

        if (response.status === 201) {
            console.log('✅ SUCCESS: Backend reported OTP sent.');
        } else {
            console.log('❌ FAILURE: Backend did not send OTP.');
        }
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Connection Refused. Is the server running on port 5000?');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
};

testRegistration();
