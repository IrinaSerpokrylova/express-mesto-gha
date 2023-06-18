const checkLength = (errors) => {
  const message = { message: '' };
  errors.forEach((error) => {
    if (error.properties.type === 'minlength') {
      message.message.concat(``);
    } else if (error.properties.type === 'maxlength') {
    }
  });
};
