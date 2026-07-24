export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: '请完整填写所有字段' });
    }

    // 只发给你自己
    const TO_EMAIL = 'lyc@lumenatelier.top';

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: [TO_EMAIL],
                subject: `【玉林选题框架】来自 ${name} 的反馈`,
                html: `
                    <p><strong>姓名：</strong>${name}</p>
                    <p><strong>邮箱：</strong>${email}</p>
                    <p><strong>反馈内容：</strong></p>
                    <p>${message.replace(/\n/g, '<br />')}</p>
                    <hr />
                    <p style="color:#999;font-size:12px;">来自 yulin.lumenatelier.top</p>
                `
            })
        });

        if (!response.ok) {
            throw new Error('Resend API error');
        }

        return res.status(200).json({ message: '反馈已发送' });
    } catch (error) {
        console.error('Feedback error:', error);
        return res.status(500).json({ error: '发送失败，请稍后重试' });
    }
}
