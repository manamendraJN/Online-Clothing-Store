import React from 'react';
import Hero from '../components/hero';
import Collection from '../components/collection';
import Product from '../components/product';
import Banner from '../components/banner';
import Cta from '../components/cta';
import Highlight from '../components/highlight';
import NewsLetter from '../components/newsLetter';
import Footer from '../components/footer';
import Nav from '../components/nav';


export default function home() {
  return (
    <div>
        <Nav />
        <Hero />
        <Collection />
        <Product />
        <Banner />
        <Cta />
        <Highlight />
        <NewsLetter />
        <Footer />
      
    </div>
  )
}
