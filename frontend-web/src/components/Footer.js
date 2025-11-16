import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

 
  const pageColors = {
    "/": "#1976d2",
    "/login": "#1976d2",
    "/cadastro": "#2e7d32",
    "/pesquisa": "#fbc02d",
    "/ranking": "#d32f2f",
    "/perfil": "#928c8cff",
  };

  const footerColor = pageColors[location.pathname] || (darkMode ? "#202124" : "#ffffff");
  const textColor = darkMode ? "#fff" : "#000";

 
  const linkStyle = {
    color: textColor,
    opacity: 0.8,
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    width: 'fit-content',
    cursor: 'pointer'
  };

  return (
    <footer style={{
      backgroundColor: footerColor,
      color: textColor,
      padding: '40px 20px 20px 20px',
      marginTop: 'auto',
      fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        alignItems: 'start',
        marginBottom: '30px'
      }}>
        
        {/* Coluna 1: Logo e descrição */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <img 
              src="/LogoSR.png" 
              alt="SmartRanking" 
              style={{ height: '45px', marginRight: '12px' }} 
            />
            <h3 style={{ 
              margin: 0, 
              color: textColor,
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              
            </h3>
          </div>
          <p style={{ 
            margin: 0,
            lineHeight: '1.6',
            color: textColor,
            opacity: 0.8,
            fontSize: '0.95rem',
            maxWidth: '400px'
          }}>
            Explore, avalie e descubra os melhores aplicativos da Google Play Store com base em critérios inteligentes e receba recomendações personalizadas.
          </p>
        </div>

        {/* Coluna 2: Links rápidos */}
        <div style={{ padding: '0 20px' }}>
          <h4 style={{ 
            margin: '0 0 20px 0',
            color: textColor,
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Navegação
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link 
              to="/" 
              style={linkStyle}
              onMouseOver={(e) => {
                e.target.style.opacity = '1';
                e.target.style.borderBottom = '2px solid currentColor';
              }}
              onMouseOut={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.borderBottom = 'none';
              }}
            >
               Home
            </Link>
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.borderBottom = '2px solid currentColor';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/cadastro" 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.borderBottom = '2px solid currentColor';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                   Cadastro
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/pesquisa" 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.borderBottom = '2px solid currentColor';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                   Pesquisas
                </Link>
                <Link 
                  to="/ranking" 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.borderBottom = '2px solid currentColor';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                  Ranking
                </Link>
                <Link 
                  to="/perfil" 
                  style={linkStyle}
                  onMouseOver={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.borderBottom = '2px solid currentColor';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.opacity = '0.8';
                    e.target.style.borderBottom = 'none';
                  }}
                >
                   Perfil
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Coluna 3: Contato e informações */}
        <div style={{ padding: '0 20px' }}>
          <h4 style={{ 
            margin: '0 0 20px 0',
            color: textColor,
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Contato & Suporte
          </h4>
          <div style={{ 
            color: textColor,
            opacity: 0.8,
            fontSize: '0.95rem',
            lineHeight: '1.8'
          }}>
            <p style={{ 
              margin: '0 0 10px 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span></span>
              <span>contato@smartranking.com</span>
            </p>
            <p style={{ 
              margin: '0 0 10px 0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span></span>
              <span>www.smartranking.com</span>
            </p>
            <p style={{ 
              margin: 0, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span></span>
              <span>Franca, SP</span>
            </p>
          </div>
        </div>

        {/* Coluna 4: Redes sociais ou informações adicionais */}
        <div style={{ padding: '0 20px' }}>
          <h4 style={{ 
            margin: '0 0 20px 0',
            color: textColor,
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            Sobre Nós
          </h4>
          <div style={{ 
            color: textColor,
            opacity: 0.8,
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 10px 0' }}>
              Plataforma inteligente para descoberta e avaliação de aplicativos da Google Play Store.
            </p>
            <p style={{ margin: 0 }}>
              Utilizando algoritmos avançados para fornecer as melhores recomendações.
            </p>
          </div>
        </div>

      </div>

      {/* Rodapé inferior */}
      <div style={{
        width: '100%',
        paddingTop: '20px',
        borderTop: `1px solid ${textColor}`,
        opacity: 0.6,
        textAlign: 'center',
        color: textColor,
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2025 Smart Ranking. Todos os direitos reservados. | 
          Desenvolvido para melhores experiências em descoberta de apps
        </p>
      </div>
    </footer>
  );
}