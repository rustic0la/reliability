import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StartPage = () => {
  const handleClick = () => {
    localStorage.clear();
  };

  return (
    <div className="App">
      <header
        style={{
          marginBottom: '50px',
          width: '100%',
        }}
        className="App-header"
      >
        Расчетный модуль надежности
      </header>
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Link
          to={'/mxgraph'}
          onClick={handleClick}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            style={{
              background: 'rgb(82, 74, 228)',
              fontSize: '20px',
              padding: '10px',
              margin: '30px',
              width: '30%',
            }}
          >
            Новая схема
          </Button>
        </Link>
      </main>
    </div>
  );
};

export default StartPage;
