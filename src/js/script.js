/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  // eslint-disable-next-line no-unused-vars
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  // eslint-disable-next-line no-unused-vars
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  class Product {
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;

      thisProduct.data = data;

      thisProduct.renderInMenu();

      thisProduct.getElements();

      thisProduct.initAccordion();

      thisProduct.initOrderForm();

      thisProduct.processOrder();

      //console.log('new Product:', thisProduct);
    }

    renderInMenu(){
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);
      //console.log('generatedHTML:', generatedHTML);

      /* create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      //console.log('menuContainer:', menuContainer);

      /*add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      //console.log('form:', thisProduct.form);

      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      //console.log('formInputs:', thisProduct.formInputs);

      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);

      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }

    initAccordion(){
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */

      /* START: click event listener to trigger */ 
      thisProduct.accordionTrigger.addEventListener('click', function(){
      
        /* prevent default active fot event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        /* find all active products */ 
        const activeProducts = document.querySelectorAll('.product.active');

        /* START LOOP: for each active product */
        for(let activeProduct of activeProducts){

          /* START: if the active product isn't the element of thisProduct */
          if(activeProduct !== thisProduct.element){

            /* remove class active for the active product */
            activeProduct.classList.remove('active');
          
          /* END: if the active product isn't the element of thisProduct */
          } 

        /* END LOOP: for each active product */
        }
        
      /* END: click event listner to trigger */
      });
    }

    initOrderForm(){
      const thisProduct = this;
      //console.log('initOrderForm:', thisProduct);

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });   
    }
  
    processOrder(){
      const thisProduct = this;
  
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData:', formData);
  
      /* set variable price to equal thisProduct.data.price */
      let price = thisProduct.data.price;
      //console.log('Product initial price:', price);
  
      /* START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in thisProduct.data.params){
  
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];
  
        /* START LOOP: for each optionId in param.options */
        for (let optionId in param.options){
  
          /* save element in param.otions with key optionId as const option */
          const option = param.options[optionId];
  
          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          //console.log('option selected:', optionSelected);
  
          if(optionSelected && !option.default){
  
            /* add price of option to variable price */
            price = price + option.price;
            //console.log('price raised by:', option.price);
  
            /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if (!optionSelected && option.default){
            /* deduct price of option from price */
            price = price - option.price;
            //console.log('price reduced:', option.price);
          }
          /* END ELSE IF: if option is not selected and option is default */
        }
        /* END LOOP: for each optionId in param.options */
      }
      thisProduct.priceElem.innerHTML = price;
      /* END LOOP: for each paramId in thisProduct.data.params */
    }



  }

  app.init();
}
