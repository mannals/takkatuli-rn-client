import React, {useState} from 'react';

// custom hook for form
const useForm = <T>(callback: () => void, initState: T) => {
  const [inputs, setInputs] = useState<T>(initState);

  // handle submit
  const handleSubmit = (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  // handle input change
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    console.log(event.target.name, event.target.value);
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs,
  };
};

export default useForm;
