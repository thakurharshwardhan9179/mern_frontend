import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Announcements.css";

const Announcements = () => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const load = async () => {

      setLoading(true);

      try {

        const res = await API.get("/announcement");
        setList(res.data);

      } catch (err) {

        console.log(err);

      }

      setLoading(false);

    };

    load();

  }, []);


  return (

    <div className="announcement-page">

      <h2 className="announcement-title">📢 Announcements</h2>

      {loading && <p className="loading">Loading...</p>}

      {!loading && list.length === 0 && (
        <div className="no-announcement">
          No announcements available
        </div>
      )}

      <div className="announcement-list">

        {list.map((a) => (

          <div key={a._id} className="announcement-card">

            <h4>{a.title}</h4>

            <p>{a.message}</p>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Announcements;