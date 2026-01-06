// Native fetch (Node 18+)

const runLoadTest = async () => {
    const TOTAL_USERS = 50; // Stimulate 50 users at once
    console.log(`--- STARTING LOAD TEST: ${TOTAL_USERS} Concurrent Users ---`);
    console.log(`Target: http://localhost:5000/api/auth/register`);

    const startTime = Date.now();
    let successCount = 0;
    let failureCount = 0;

    const requests = Array.from({ length: TOTAL_USERS }).map(async (_, index) => {
        const id = index + 1;
        const fakeIp = `192.168.${Math.floor(index / 255)}.${index % 255}`; // Unique IP per user
        const email = `loadtest.user${id}.${Date.now()}@example.com`;

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Forwarded-For': fakeIp // Simulate distinct users to bypass rate limiter
                },
                body: JSON.stringify({
                    name: `Load User ${id}`,
                    email: email,
                    password: 'password123'
                })
            });

            if (response.status === 201) {
                // Success (201 Created - Email Sent)
                process.stdout.write('S');
                return true;
            } else {
                // Failure
                process.stdout.write('F');
                return false;
            }
        } catch (error) {
            process.stdout.write('E');
            return false;
        }
    });

    const results = await Promise.all(requests);

    successCount = results.filter(r => r === true).length;
    failureCount = results.filter(r => r === false).length;

    const duration = (Date.now() - startTime) / 1000;

    console.log('\n\n--- LOAD TEST RESULTS ---');
    console.log(`Total Requests: ${TOTAL_USERS}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log(`Time Taken: ${duration}s`);
    console.log(`Requests/Sec: ${(TOTAL_USERS / duration).toFixed(2)}`);
    console.log('-------------------------');
};

runLoadTest();
