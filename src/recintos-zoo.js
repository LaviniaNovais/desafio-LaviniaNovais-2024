class RecintosZoo {
    constructor() {
        // Set animals standards
        this.animais = {
            "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
        };

        // Set enclosure standards
        this.recintos = [
            { numero: 1, biomas: ["savana"], tamanhoTotal: 10, animais: ["3 MACACO"], tamanhoOcupado: this.calculaOcupacao(["3 MACACO"]) },
            { numero: 2, biomas: ["floresta"], tamanhoTotal: 5, animais: [], tamanhoOcupado: 0 },
            { numero: 3, biomas: ["savana", "rio"], tamanhoTotal: 7, animais: ["1 GAZELA"], tamanhoOcupado: this.calculaOcupacao(["1 GAZELA"]) },
            { numero: 4, biomas: ["rio"], tamanhoTotal: 8, animais: [], tamanhoOcupado: 0 },
            { numero: 5, biomas: ["savana"], tamanhoTotal: 9, animais: ["1 LEAO"], tamanhoOcupado: this.calculaOcupacao(["1 LEAO"]) }
        ];
    }

    // Calculate current occupation
    calculaOcupacao(animaisRecinto) {
        let totalOcupacao = 0;
        animaisRecinto.forEach(animalString => {
            const [quantidade, especie] = animalString.split(" ");
            const especieMaiuscula = especie.toUpperCase();
    
            if (this.animais.hasOwnProperty(especieMaiuscula)) {
                const tamanhoAnimal = this.animais[especieMaiuscula].tamanho;
                totalOcupacao += parseInt(quantidade) * tamanhoAnimal;
            }
        });
        return totalOcupacao;
    }

    // Evaluate envs capacity for a certain animal and its quantity
    analisaRecintos(animal, quantidade) {
        animal = animal.toUpperCase(); 

        if (!this.animais.hasOwnProperty(animal)) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalInfo = this.animais[animal];
        const espacoNecessario = animalInfo.tamanho * quantidade;
        let recintosViaveis = [];

        this.recintos.forEach(recinto => {
            let espacoLivre = recinto.tamanhoTotal - recinto.tamanhoOcupado;

            // When there is more than one species, subtract one extra space
            if (recinto.animais.length > 0 && !recinto.animais.every(a => a.includes(animal))) {
                espacoLivre -= 1; // Subtract extra space
            }

            // Ensure the biome is suitable
            const biomaCompativel = animalInfo.biomas.some(bioma => recinto.biomas.includes(bioma));
            if (!biomaCompativel || espacoLivre < espacoNecessario) {
                return; // Skip this enclosure if the biome or space is not sufficient
            }

            // Carnivores must only inhabit with their own species
            if (animalInfo.carnivoro) {
                const contemCarnivoro = recinto.animais.some(a => {
                    const [, especie] = a.split(" ");
                    return this.animais[especie.toUpperCase()].carnivoro;
                });
                if (contemCarnivoro || recinto.animais.length > 0) {
                    return; // Carnivores can only stay with their own species
                }
            }

            // Non-carnivores should not be placed in a carnivore's enclosure
            const contemCarnivoro = recinto.animais.some(a => {
                const [, especie] = a.split(" ");
                return this.animais[especie.toUpperCase()].carnivoro;
            });
            if (!animalInfo.carnivoro && contemCarnivoro) {
                return; // Non-carnivores cannot inhabit with carnivores
            }

            // Hippos can only tolerate other species in enclosures with both savanna and river biomes
            if (animal === "HIPOPOTAMO" && recinto.animais.length > 0 && !(recinto.biomas.includes("savana") && recinto.biomas.includes("rio"))) {
                return;
            }

            // Monkeys require at least one other animal in the enclosure
            if (animal === "MACACO" && recinto.animais.length === 0 && quantidade === 1) {
                return;
            }

            // Printable list
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre-espacoNecessario} total: ${recinto.tamanhoTotal})`);
        });

        // Final Printing
        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };



/*
// Test of the functionality

const zoo = new RecintosZoo();

console.log(zoo.analisaRecintos("CROCODILO", 1));
console.log(zoo.analisaRecintos("MACACO", 2)); 
console.log(zoo.analisaRecintos("LEAO", 1));
console.log(zoo.analisaRecintos("HIPOPOTAMO", 1));
console.log(zoo.analisaRecintos("UNICORNIO", 1));

*/

