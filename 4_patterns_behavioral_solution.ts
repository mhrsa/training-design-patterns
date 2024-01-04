import inquirer from "inquirer";

class Person {
    constructor(public name: string, public age: number, public nif: string) {}
}

interface PersonObserver {
    newPersonAdded(person: Person): void;
}

class PersonAgeObserver implements PersonObserver{
    newPersonAdded(person: Person): void {
        console.log("Person was added");
    }
}

class PersonNifObserver implements PersonObserver{
    newPersonAdded(person: Person): void {        
        console.log(isValidNIF(person.nif));
    }
}

function isValidNIF(nif: string): boolean {
    // Basic length and format check    
    if (!nif || nif.length !== 9 || !/^\d+$/.test(nif)) {        
        return false;
    }

    const validationSequence = [9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;

    // Calculate the checksum
    for (let i = 0; i < validationSequence.length; i++) {
        sum += parseInt(nif[i]) * validationSequence[i];
    }

    const checkDigit = 11 - (sum % 11);
    const finalDigit = (checkDigit >= 10) ? 0 : checkDigit;

    // Compare the final digit with the control digit
    return finalDigit === parseInt(nif[8]);
}

interface Iterator<T> {
    next(): T;
    hasNext(): boolean;
}

interface IsIterable<T> {
    getIterator(): Iterator<T>
}

class PersonCollection implements IsIterable<Person>{
    private persons: Map<string, Person> = new Map<string, Person>();
    private observers: PersonObserver[] = [];

    addObserver(observer: PersonObserver): void {
        this.observers.push(observer);
    }

    addPerson(person: Person): void {
        this.persons.set(person.nif, person);
        this.notifyObservers(person);
    }

    getPerson(nif: string){
        this.persons.get(nif)
    }

    private notifyObservers(person: Person): void {
        this.observers.forEach(observer => observer.newPersonAdded(person));
    }

    getIterator(): Iterator<Person> {
        return new PersonIterator(this.persons);
    }
}


class PersonIterator implements Iterator<Person> {
    private keys: string[];
    private currentPosition: number = 0;
    private map: Map<string, Person>;

    constructor(map: Map<string, Person>) {
        this.map = map;
        this.keys = Array.from(map.keys());
    }

    public next(): Person {
        const key = this.keys[this.currentPosition];
        const value = this.map.get(key);

        if(value == null)
            throw new Error("Person is undefined");

        this.currentPosition++;
        return value;
    }

    public hasNext(): boolean {
        return this.currentPosition < this.keys.length;
    }
}

class CommandLineInterface {

    constructor(private personCollection: PersonCollection){}

    async createPerson(){
        const answers = await inquirer.prompt([
            {
                type: "text",
                name: "name",
                message: "Person name?"
            },
            {
                type: "number",
                name: "age",
                message: "Person age?"
            },
            {
                type: "text",
                name: "nif",
                message: "Person nif?"
            }
        ])

        const {name, age, nif} = answers;
        const person = new Person(name, age, nif);
        this.personCollection.addPerson(person);
    }

    listAllPersons(){

        const iterator = personCollection.getIterator();

        while (iterator.hasNext()) {
            const person = iterator.next();
            console.log(`Person with name ${person.name}, age: ${person.name} and nif ${person.nif}`);
        }
        

    }

    async main(){
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add Person','Get Person', 'List All People', 'Exit'],
            }
        ]);
    
        switch (answers.action) {
            case 'Add Person':
                await this.createPerson();
                await this.main()
                break;
            case 'Get Person':

                await this.main()
                break;
            case 'List All People':
                await this.listAllPersons();
                await this.main()
                break;
            case 'Exit':
                return;
        }
    }
}

const ageObserver = new PersonAgeObserver()
const nifObserver = new PersonNifObserver()
const personCollection = new PersonCollection()
personCollection.addObserver(ageObserver);
personCollection.addObserver(nifObserver);

const cli = new CommandLineInterface(personCollection)
cli.main()