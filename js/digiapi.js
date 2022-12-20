export class DigiApi {
    static search() {
        const endpoint = 'https://digimon-api.vercel.app/api/digimon'

        return fetch(endpoint)
        .then(data => data.json())
    }
}

