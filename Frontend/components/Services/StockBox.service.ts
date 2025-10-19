class StockBoxService {
    public async uploadBillImage(file: File, text?: string) {
        const formData = new FormData();
        formData.append('image', file);
        if (text) {
            formData.append('text', text);
        }

        return fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/create_plan/`,
            {
                method: 'POST',
                body: formData,
            }
        )
        .then((res) => res.json())
        .then((data) => {
            console.log('Upload response:', data);
            return data;
        });
    }

    public async sendMessage(message: string) {
        return fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/create_plan/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            }
        )
        .then((res) => res.json())
        .then((data) => {
            console.log('Message response:', data);
            return data;
        });
    }
}

export default new StockBoxService();
