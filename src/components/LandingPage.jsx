import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieGrids from './MoviesGrid.jsx';
import styles from '../style/LandingPage.module.css';

function LandingPage() {
  const [movies, setMovies] = useState([]);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const genreRes = await axios.get(`${import.meta.env.VITE_BASE}/genre/movie/list?api_key=${import.meta.env.VITE_API_KEY}`);
        const genres = genreRes.data.genres;
        const mapping = {};
        genres.forEach(g => mapping[g.id] = g.name);
        setGenreMap(mapping);

        const movieRes = await axios.get(`${import.meta.env.VITE_BASE}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}`);
        setMovies(movieRes.data.results);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <section className={styles.hero}>
  <div className={styles.heroLeft}>
    <p className={styles.highlight}>MOVIE TICKET PURCHASES #1 IN INDONESIA</p>
    <h1>Experience the Magic of Cinema: Book Your Tickets Today</h1>
    <p className={styles.desc}>Sign up and get the ticket with a lot of discount</p>
  </div>
</section>

<section className={styles.whyChooseUs}>
  <div className={styles.sectionHeader}>
    <p className={styles.sectionSubtitle}>WHY CHOOSE US</p>
    <h2 className={styles.sectionTitle}>Unleashing the Ultimate Movie Experience</h2>
  </div>

  <div className={styles.stepContainer}>
    <div className={styles.step}>
      <div className={styles.circle}><img src="../../img/Shield Done.png" alt="" /></div>
      <h4>Guaranteed</h4>
      <p>Lorem ipsum dolor sit amet, consectetur adipis elit...</p>
    </div>
    ...
  </div>
</section>

<section>
  <div className={styles.container}>
    <div className={styles.header}>
      <div>
        <div className={styles.sectionTitle2}>MOVIES</div>
        <h1 className={styles.mainTitle}>Exciting Movies That Should Be Watched Today</h1>
        <p className={styles.highlight2}>MOVIE TICKET PURCHASES #1 IN INDONESIA</p>
      </div>
    </div>
    <MovieGrids movies={movies.slice(0, 4)} genreMap={genreMap} />
  </div>
</section>

<section>
  <div className={styles.container}>
    <div className={styles.header2}>
      <div>
        <div className={styles.sectionTitle2}>Upcoming Movies</div>
        <h1 className={styles.mainTitle}>Exciting Movie Coming Soon</h1>
        <p className={styles.highlight2}>MOVIE TICKET PURCHASES #1 IN INDONESIA</p>
      </div>
      <div className={styles.navigation}>
        <button className={styles.navBtn}>‹</button>
        <button className={styles.navBtn}>›</button>
      </div>
    </div>
    <MovieGrids movies={movies.slice(0, 4)} genreMap={genreMap} />
  </div>
</section>

<section>
  <div className={styles.newsletterContainer}>
    <div className={styles.decorativeShape}></div>
    <div className={styles.content}>
      <h2 className={styles.title}>Subscribe to our newsletter</h2>
      <form className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <input type="email" className={styles.inputField} placeholder="Enter your email" required />
        </div>
        <div className={styles.inputGroup}>
          <input type="text" className={styles.inputField} placeholder="Your name" required />
        </div>
        <button type="submit" className={styles.submitBtn}>Subscribe Now</button>
      </form>
    </div>
  </div>
</section>

    </>
  );
}

export default LandingPage;
