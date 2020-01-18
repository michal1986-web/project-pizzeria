import {settings, select, classNames} from './settings.js';
import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {Booking} from './components/Booking.js';

const app = {
  initBooking: function(){
    const thisApp = this;
    
    const bookingWidget = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingWidget);
  },

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* TODO: get page id from href */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* TODO: activate page */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    for (let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        //console.log('parsedResponse:', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execte initMenu method */
        thisApp.initMenu();
      });
    //console.log('thisApp.data:', JSON.stringify(thisApp.data));
  },

  initCarousel() {
    // eslint-disable-next-line no-unused-vars
    const thisApp = this;
    const review = [];

    review[0] = {
      title: 'Pizza is really delicious!',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt mi vel erat feugiat, vel porta nunc porta. Proin posuere dictum quam, a congue magna placerat ac.',
      author: 'Brian D.',

    };
    review[1] = {
      title: 'Great service :)',
      content: 'Quisque eu eros ac nisl volutpat vehicula sit amet sit amet nibh. Nam in neque condimentum, interdum augue id, suscipit dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      author: 'Allan G.',
    };
    review[2] = {
      title: 'I recommend to everyone...',
      content: 'Sed consectetur mollis faucibus. Suspendisse et eleifend elit. Fusce varius hendrerit arcu, quis iaculis enim imperdiet quis. Pellentesque consectetur felis a cursus porttitor. Sed lobortis blandit tortor.',
      author: 'Andrew B.', 
    };
    let i = 0;

    const dots = document.querySelectorAll('.home__carousel--dots i');

    function changeTitle() {

      const title = document.querySelector('.home__carousel--title');
      const content = document.querySelector('.home__carousel--content');
      const author = document.querySelector('.home__carousel--author');

      for (let dot of dots) {
        if (dot.id == i + 1) { // +1 ??
          // console.log(dot.id);
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
        title.innerHTML = review[i].title;
        content.innerHTML = review[i].content;
        author.innerHTML = review[i].author;
      }

      if (i < review.length - 1) {
        i++;
      } else {
        i = 0;
      }
    }
    changeTitle();

    setInterval(() => {
      changeTitle();
    }, 3000);
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initCarousel();
  },
};

app.init();
