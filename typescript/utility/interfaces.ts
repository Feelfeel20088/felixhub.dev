interface ChatRequest {
    content: string,
    images: [String]
}

interface SignupRequestBody {
    username: string;
    email: string;
    password: string;
}

export {ChatRequest, SignupRequestBody};