
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Doce Delícia',
      description: 'Cupcakes artesanais feitos com ingredientes selecionados e muito amor. Entregamos doçura e felicidade em cada mordida!',
    },
    {
      title: 'Links Rápidos',
      links: [
        { name: 'Sobre Nós', path: '/about-us' },
        { name: 'Cardápio Completo', path: '/' },
        { name: 'Encomendas Especiais', path: '/special-orders' },
        { name: 'Política de Entrega', path: '/delivery-policy' },
      ],
    },
    {
      title: 'Contato',
      details: [
        'Rua dos Doces, 123',
        'contato@docedelicia.com',
        '(11) 99999-9999',
      ],
    },
  ];

  return (
    <motion.footer 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="bg-pink-100 text-pink-800 py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <p className="text-xl font-fancy font-semibold mb-4 text-pink-600">{section.title}</p>
              {section.description && <p className="text-sm leading-relaxed">{section.description}</p>}
              {section.links && (
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-sm hover:text-pink-500 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {section.details && (
                <div className="space-y-1 text-sm">
                  {section.details.map((detail, i) => (
                    <p key={i}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-pink-300 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Doce Delícia. Todos os direitos reservados.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
  