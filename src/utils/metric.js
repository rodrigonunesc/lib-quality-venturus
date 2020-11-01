module.exports.t = (projectsData) => {
  const obj = projectsData.reduce((accumulator, current) => {
    accumulator[current.full_name] = current.full_name;
    return accumulator;
  }, {});
  return obj;
};
