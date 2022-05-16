function APIFeatures(query, queryString) {
  this.query = query;
  this.queryString = queryString;

  this.paginating = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);

    return this;
  };
  this.sorting = () => {
    const sort = this.queryString.sort || "-createdAt";
    this.query = this.query.sort(sort);
    return this;
  };
  this.filtering = () => {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);
    const filter = queryObj.filter;
    const status = filter ? { status: filter } : "" || {};

    this.query = this.query.find(status);
    return this;
  };
}

module.exports = APIFeatures;
