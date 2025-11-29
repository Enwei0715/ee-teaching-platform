const http = require('http');

const data = JSON.stringify({
    markdown: `## Introduction
This is just an intro. It is very short.

## Section A: Basic Concepts
This section explains the core principle. Voltage is defined as the potential difference between two points. It is measured in Volts. This is a very important concept because it forms the basis of all circuit theory. We will see an example later.

## Section B: Summary
This is a summary of what we learned.

## Section C: Advanced Theory
This section is extremely short.

## Section D: Detailed Analysis
This section goes into detail about the formula. Therefore, we can see that V = IR. This means that voltage is proportional to current. For example, if resistance is constant, doubling voltage doubles current. This principle is fundamental. The definition of resistance is the opposition to current flow. Unlike the previous section, this one is long enough to be considered for a quiz. It has enough content to generate a meaningful question. We want to avoid fluff and focus on real content.`,
    currentHeadingId: null // Review Mode (All sections)
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/test-algo',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(body);
            console.log("SCORED SECTIONS:");
            json.scoredSections.forEach(s => {
                console.log(`[${s.score}] ${s.title} - Reasons: ${s.reasons.join(', ')}`);
            });
        } catch (e) {
            console.log("BODY:", body);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
