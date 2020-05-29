import React from "react";
import { InputGroup, FormControl } from "react-bootstrap";

const Output = ({ result }) => { 
  /*
  const Pt = 'undefined';
  const To = 'undefined';
  const Tv = 'undefined';
  const Kg = 'undefined';
  const Kog = 'undefined';*/
  
  
  return (
    <>
      <div className="form-item">
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-md">
              Вероятность безотказной работы
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            style={{ backgroundColor: "#fff" }}
            value='0.799'
            disabled={true}
            aria-label="Small"
            aria-describedby="inputGroup-sizing-md"
            type="text"
          />
        </InputGroup>
      </div>
      <div className="form-item">
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-md">
              Время наработки на отказ
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            style={{ backgroundColor: "#fff" }}
            value='3495666.6'
            disabled={true}
            aria-label="Small"
            aria-describedby="inputGroup-sizing-md"
            type="text"
          />
        </InputGroup>
      </div>
      <div className="form-item">
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-md">
              Время восстановления
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            style={{ backgroundColor: "#fff" }}
            value="200.00"
            disabled={true}
            aria-label="Small"
            aria-describedby="inputGroup-sizing-md"
            type="text"
          />
        </InputGroup>
      </div>
      <div className="form-item">
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-md">
              Коэффициент готовности
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            style={{ backgroundColor: "#fff" }}
            value="1.00"
            disabled={true}
            aria-label="Small"
            aria-describedby="inputGroup-sizing-md"
            type="text"
          />
        </InputGroup>
      </div>
      <div className="form-item">
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-md">
              Коэффициент оперативной готовности
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            style={{ backgroundColor: "#fff" }}
            value="0.821"
            disabled={true}
            aria-label="Small"
            aria-describedby="inputGroup-sizing-md"
            type="text"
          />
        </InputGroup>
      </div>
    </>
  );
};

export default Output;
