import sendAPICall from "../auth/APIs";

export async function sendVerificationEmail(user){
    sendAPICall(`/sendVerificationEmail`, 'POST', {}, user)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}