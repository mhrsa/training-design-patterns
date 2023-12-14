import inquirer from 'inquirer';

type RequirementDescription = {
    code: string
    description: string
}

class RequirementsDocument {
    author?: string
    name?: string
    project?: string
    requirements?: RequirementDescription[]

    print(){
        console.log(`Author:${this.author}`)
        console.log(`Name:${this.name}`)
        console.log(`Project:${this.project}`)
        console.log("Requirements:")
        console.table(this.requirements)
    }
}

class RequirementsDocumentBuilder  {

    author?: string
    name?: string
    project?: string
    requirements?: RequirementDescription[]

    private static instance: RequirementsDocumentBuilder

    private constructor() { }

    public static getInstance(): RequirementsDocumentBuilder {
        if (!RequirementsDocumentBuilder.instance) {
            RequirementsDocumentBuilder.instance = new RequirementsDocumentBuilder();
        }

        return RequirementsDocumentBuilder.instance;
    }

    public withAuthor(author:string){
        this.author = author;
        return this;
    }

    public withName(name:string){
        this.name = name;
        return this;
    }

    public withProject(project:string){
        this.project = project;
        return this;
    }

    public withRequirement(code: string, description: string)
    {
        if (this.requirements == null)
            this.requirements = [];

        this.requirements.push({code, description});
        return this;
    }

    public clear()
    {
        this.author = undefined;
        this.name = undefined;
        this.project = undefined;
        this.requirements = undefined;
    }

    public build(){
       const doc = new RequirementsDocument();
       doc.author = this.author;
       doc.name = this.name;
       doc.project = this.project;
       doc.requirements = this.requirements;
       return doc;
    }
}

/** Exercise **/
/** Use a creational pattern to create an instance of RequirementsDocument **/
/** Example: Factory, Builder or Singleton **/
class CommandLineInterface {
    
    private async addAuthor(){        
        const authorInquirer = await inquirer.prompt([
            {
                type: "text",
                name: "author",
                message: "Document Author?"
            }])

            RequirementsDocumentBuilder.getInstance().withAuthor(authorInquirer.author);
            console.log("My document author is:", authorInquirer.author)
    }

    private async addName(){
        const nameInquirer = await inquirer.prompt([
            {
                type: "text",
                name: "name",
                message: "Document Name?"
            }])

            RequirementsDocumentBuilder.getInstance().withName(nameInquirer.name);
            console.log("My document name is:", nameInquirer.name)
    }

    private async addProject(){
        const projectInquirer = await inquirer.prompt([
            {
                type: "text",
                name: "project",
                message: "Document Project?"
            }])

            RequirementsDocumentBuilder.getInstance().withProject(projectInquirer.project);            
            console.log("My document project is:", projectInquirer.project);
    }

    private async addRequirement(){
        const requirementInquirer = await inquirer.prompt([
            {
                type: "text",
                name: "code",
                message: "Requirements Code?"
            }, 
            {
                type: 'text',
                name: 'description',
                message: "Requirements Description?"
            }])

            RequirementsDocumentBuilder.getInstance().withRequirement(requirementInquirer.code, requirementInquirer.description);            
            console.log(`My document requirement added with Code ${requirementInquirer.code} and description ${requirementInquirer.description}`)
    }

    private create()
    {
        const document = RequirementsDocumentBuilder.getInstance().build();
        document.print();
    }
    
    private clear()
    {
        RequirementsDocumentBuilder.getInstance().clear();       
        console.log("My document is cleared");
    }

    async main(){
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add Author','Add Name', 'Add Project', 'Add Requirement', 'Create', 'Clear', 'Exit'],
            }
        ]);
    
        switch (answers.action) {
            case 'Add Author':
                // Add an author
                await this.addAuthor();
                await this.main();
                break;
            case 'Add Name':
                await this.addName();
                await this.main();
                break;
            case 'Add Project':
                await this.addProject();
                await this.main();
                break;
            case 'Add Requirement':
                await this.addRequirement();
                await this.main();
                break;
            case 'Create':                
                this.create();
                return;
                break;
            case 'Clear':
                this.clear();
                await this.main();
                break;            
            case 'Exit':
                return;
        }
    }
}

const cli = new CommandLineInterface()
cli.main()