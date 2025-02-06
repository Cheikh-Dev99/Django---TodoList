import PropTypes from "prop-types";

export default function TodoFilter({ filter, setFilter }) {
  return (
    <form className="flex items-center gap-4 my-4">
      <div className="flex items-center">
        <input
          type="radio"
          id="checkbox-tous"
          name="statut"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
          className="m-1"
        />
        <label htmlFor="checkbox-tous" className="mr-5">
          Tous
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="radio"
          id="checkbox-actives"
          name="statut"
          checked={filter === "active"}
          onChange={() => setFilter("active")}
          className="m-1"
        />
        <label htmlFor="checkbox-actives" className="mr-5">
          Actives
        </label>
      </div>

      <div className="flex items-center">
        <input
          type="radio"
          id="checkbox-termines"
          name="statut"
          checked={filter === "completed"}
          onChange={() => setFilter("completed")}
          className="m-1"
        />
        <label htmlFor="checkbox-termines" className="mr-5">
          Terminées
        </label>
      </div>
    </form>
  );
}

TodoFilter.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};
