import inquirer from 'inquirer';

enum EntityType {
    book,
    user
}

abstract class IEntity {
    public name: string    
    public type: EntityType
    
    constructor(name: string, type: EntityType,){
        this.name = name        
        this.type = type
    }

    public abstract getDescription() : void;
}

class Book extends IEntity{

    public isbn?: string

    constructor(name: string, isbn?:string){
        super(name, EntityType.book)
        this.isbn = isbn;
    }

    public getDescription(){
        return `Book with name:"${this.name}" and isbn:"${this.isbn}"`;        
    }
}

class User extends IEntity{
    public age: number

    constructor(name: string,  age: number){
        super(name, EntityType.user)

        this.age = age;
    }

    public  getDescription(){
        return `User with name:"${this.name} and age ${this.age}"`
    }
}


class BooksManagement {
    books: IEntity[];
    
    constructor(){
        this.books = [];
    }

    addBook(book: IEntity) {
        this.books.push(book);
        return book
    }

    removeBook(bookName: string) {
        const book = this.getBook(bookName)
        this.books = this.books.filter(book => book.name !== bookName);
        return book
    }

    getBooks(){
        return this.books
    }

    getBook(bookName: string){
        const book = this.books.find(book => book.name === bookName);
        return book
    };
}

class UsersManagement {
    users: IEntity[];

    constructor(){
        this.users = [];
    }

    addUser(user: IEntity) {
        this.users.push(user);
        return user
    }

    removeUser(userName: string) {
        const user = this.getUser(userName)
        this.users = this.users.filter(book => book.name !== userName);
        return user
    }

    getUser(userName: string){
        const user = this.users.find(user => user.name === userName);
        return user
    }    

    getUsers(){
        return this.users
    }
}

class CommandLineInterface {
    libraryManager: BooksManagement
    usersManagement: UsersManagement
    constructor(libraryManagement: BooksManagement, usersManagement : UsersManagement){
        this.libraryManager = libraryManagement;
        this.usersManagement = usersManagement;
    }

    async addBook(){
        const bookData = await inquirer.prompt<Book>([
            {
                type: 'text',
                name: 'name',
                message: 'Book Name?',
            }, 
            {
                type: 'text',
                name: 'isbn',
                message: 'Book ISBN?',
            }
        ]);

        const newBook = this.libraryManager.addBook(new Book(bookData.name, bookData.isbn))
        console.log(`Added book ${newBook.getDescription()}"`)
    }

    listBooks(){
        const books = this.libraryManager.getBooks()
        console.table(books)
    }

    async getBook(){
        const book = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'Book Name?'
            }
        ])

        const result = this.libraryManager.getBook(book.name);

        if (result){
            console.log(`Book retrieved ${result?.getDescription()}`);
        }else{
            console.log(`Book not found`);
        }        
    }

    async removeBook(){
        const book = await inquirer.prompt([
            {
                name: 'name',
                message: 'Book Name to remove?'
            }
        ]);

        const result = this.libraryManager.removeBook(book.name);

        if (result){
            console.log(`Book ${result?.getDescription()} deleted`);
        }else{
            console.log(`Book not found`);
        }        
    }

    async addUser(){
        const user = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'User Name?',
            }, 
            {
                type: 'text',
                name: 'age',
                message: 'User Age?',
            }
        ]);

        var newUser = new User(user.name, user.age);
        newUser.age = user.age;
        
        const createdUser = this.usersManagement.addUser(newUser);
        console.log(`Added user ${newUser.getDescription()}"`)
    }

    listUsers(){
        const users = this.usersManagement.getUsers()
        console.table(users)
    }

    async removeUser(){
        const user = await inquirer.prompt([
            {
                name: 'name',
                message: 'User Name to remove?'
            }
        ]);

        const result = this.usersManagement.removeUser(user.name);

        if (result){
            console.log(`User ${result?.getDescription()} deleted`);
        }else{
            console.log(`User not found`);
        }        
    }

    async getUser(){
        const user = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'User Name?'
            }
        ])

        const result = this.usersManagement.getUser(user.name);

        if (result){
            console.log(`Retrieved User ${result?.getDescription()}`);
        }else{
            console.log(`User not found`);
        }        
    }

    async main(){
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add Book','List Books', 'Remove Book', 'Add User', 'List Users', 'Remove User', 'Get User', 'Get Book', 'Exit'],
            }
        ]);
    
        switch (answers.action) {
            case 'Add Book':
                await this.addBook()
                this.main()
                break;
            case 'List Books':
                await this.listBooks() 
                this.main()
                break;
            case 'Remove Book':
                await this.removeBook() 
                this.main()
                break;                
            case 'Get Book':
                await this.getBook();
                this.main();
                break;
            case 'Add User':
                await this.addUser();
                this.main();
                break;
            case 'Remove User':
                await this.removeUser();
                this.main();
                break;
            case 'List Users':
                this.listUsers();
                this.main();
                break;                
            case 'Get User':
                await this.getUser();
                this.main();
                break;
            case 'Exit':
                return;
        }
    }
}

 
const cli = new CommandLineInterface(new BooksManagement(), new UsersManagement())
cli.main()
