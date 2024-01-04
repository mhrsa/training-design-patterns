import inquirer from "inquirer";

// ProductComponent interface
interface ProductComponent {
    display(): string;
    getPrice(): number;
    getCode(): string;
}

// Individual Product
class Product implements ProductComponent {
    constructor(private code: string, public name: string, private price: number) {}

    display(): string {
        return `Product: ${this.name} (Price: $${this.price})`;
    }

    getPrice(): number {
        return this.price;
    }

    getCode(): string {
        return this.code
    }
}

// Product Bundle
class ProductBundle implements ProductComponent {
    private children: ProductComponent[] = [];

    constructor(public code: string, public name: string) {}

    add(child: ProductComponent): void {
        this.children.push(child);
    }

    display(): string {
        return `Bundle: ${this.name}\n` + this.children.map(child => `  ${child.display()}`).join('\n');
    }

    getPrice(): number {
        return this.children.reduce((total, child) => total + child.getPrice(), 0);
    }

    getCode(): string {
        return this.code
    }
}

class ProductComponentManager<T extends ProductComponent> {
    products: T[]

    constructor(){
        this.products = []
    }

    getProduct(code: string){
        const product = this.products.find(p => p.getCode() === code);
        return product
    }

    addProduct(product: T){
        this.products.push(product)
    }

    deleteProduct(code: string){
        const product = this.getProduct(code)
        this.products = this.products.filter(p => p.getCode() !== code);
        return product
    }
}

// Create a SpecialOffer adapter to the ProductComponent
class DiscountedProduct {
    
    constructor(private offerName: string, private discountRate: number, private originalProduct: Product) {}

    getDetails(): string {
        return `Special Offer: ${this.offerName} (Discount: ${this.discountRate}%)`;
    }

    getDiscountedPrice(): number {
        return this.originalProduct.getPrice() * (1 - this.discountRate / 100);
    }

    getCode(): string {
        return this.originalProduct.getCode();
    }    
}

class DiscountedProductAdapter implements ProductComponent {

    constructor(private specialOffer: DiscountedProduct){}

    display(): string {
        //Vai chamar o getDetails do DiscountedProduct
        return this.specialOffer.getDetails();
        //throw new Error("Method not implemented.");
        
    }
    getPrice(): number {
        return this.specialOffer.getDiscountedPrice();
        //throw new Error("Method not implemented.");
    }
    getCode(): string {
        return this.specialOffer.getCode();
        //throw new Error("Method not implemented.");
    }
}

class ProductFacade{

    private productManager: ProductComponentManager<Product>;
    private productBundleManager: ProductComponentManager<ProductBundle>;
    private discountManager: ProductComponentManager<DiscountedProductAdapter>;

    constructor(){
        this.productManager = new ProductComponentManager<Product>()
        this.productBundleManager = new ProductComponentManager<ProductBundle>()
        this.discountManager = new ProductComponentManager<DiscountedProductAdapter>()
    }

    addProduct(child: Product): void {
        this.productManager.addProduct(child);
    }

    addProductBundle(child: ProductBundle): void {
        productBundleManager.addProduct(child);
    }

    addProductToBundle(product: Product, bundleCode: string): void {
        let bundle = productBundleManager.getProduct(bundleCode);
        if(bundle){
            bundle.add(product);                                                           
        }else{
            console.error("Bundle does not exists")
        }
    }
    
}



const productManager = new ProductComponentManager<Product>()
const productBundleManager = new ProductComponentManager<ProductBundle>()
const discountManager = new ProductComponentManager<DiscountedProductAdapter>()
const productFacade = new ProductFacade();

class CommandLineInterface {

    async addProduct(){
        const answers = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'Product name?',                
            },
            {
                type: 'text',
                name: 'code',
                message: 'Product code?',                
            },
            {
                type: 'number',
                name: 'price',
                message: 'Product price?',                
            }
        ]);

        const {name, code, price} = answers;
        var newProduct = new Product(code, name, price);
        productFacade.addProduct(newProduct);
    }

    //async addProductBundle(){
    //    const answers = await inquirer.prompt([
    //        {
    //            type: 'text',
    //            name: 'name',
    //            message: 'Product name?',                
    //        },
    //        {
    //            type: 'text',
    //            name: 'code',
    //            message: 'Product code?',                
    //        }
    //    ]);
    //
    //    const {code, name} = answers;
    //    var newProduct = new ProductBundle(code, name);
    //    productFacade.addProductBundle(newProduct);
    //}

    async askForProductCodes(productCodes:string[] = []) : Promise<string[]>{
        const {productCode} = await inquirer.prompt([
            {
                type: 'text',
                name: 'productCode',
                message: 'Enter a product code (or press enter to finish)?',                
            }
        ]);

        if(productCode){
            productCodes.push(productCode);
            return this.askForProductCodes(productCodes);
        }else{
            return productCode;
        }

    }


    async addBundle(){
        const answers = await inquirer.prompt([
            {
                type: 'text',
                name: 'name',
                message: 'Bundle name?',                
            },
            {
                type: 'text',
                name: 'code',
                message: 'Bundle code?',                
            }
        ]);

        const productCodes = await this.askForProductCodes();

        console.log(`Adding product codes ${productCodes} to bundle`)
        const {code, name} = answers;
        var newProduct = new ProductBundle(code, name);
        productFacade.addProductBundle(newProduct);
    }



    async main(){
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: ['Add Product','Add Product Bundle', 'Add Discount', 'Get All Products', 'Get All Bundles', 'Get All Discounts', 'Exit'],
            }
        ]);
    
        switch (answers.action) {
            case 'Add Product':
                await this.addProduct();
                await this.main()
                break;
            case 'Add Product Bundle':
                await this.addBundle();
                await this.main()
                break;
            case 'Add Discount':
                await this.main()
                break;
            case 'Get All Products':

                await this.main()
                break;
            case 'Get All Bundles':

                await this.main()
                break;
            case 'Get All Discounts':

                await this.main()
                break;
            case 'Exit':
                return;
        }
    }
}

const cli = new CommandLineInterface()
cli.main()