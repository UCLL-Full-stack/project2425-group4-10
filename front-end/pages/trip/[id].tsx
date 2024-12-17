import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import tripService from '@/services/tripService';
import { Trip } from '@/types';
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/TripDetails.module.css';
import { useEffect, useState } from 'react';
import errorStyles from '../../styles/errorMessage.module.css';

type Props = {
    initialTrip: Trip | null;
};

const TripDetails: React.FC<Props> = ({ initialTrip }) => {
    const { t } = useTranslation('common');
    const router = useRouter();
    const [trip, setTrip] = useState<Trip | null>(initialTrip);
    const [loading, setLoading] = useState(!initialTrip);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const token = loggedInUser ? JSON.parse(loggedInUser).token : null;
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        if (!initialTrip) {
            const fetchTrip = async () => {
                const loggedInUser = localStorage.getItem('loggedInUser');
                const token = loggedInUser ? JSON.parse(loggedInUser).token : null;
                if (token) {
                    const response = await tripService.getTripById(router.query.id as string, token);
                    const fetchedTrip = await response.json();
                    setTrip(fetchedTrip);
                    setLoading(false);
                }
            };
            fetchTrip();
        }
    }, [initialTrip, router.query.id]);

    if (!isLoggedIn) {
        return (
            <>
            <Head><title>Loading...</title></Head>
            <Navbar/>
            <div className={styles['trip-details-body']}>
                <div className={errorStyles.logInMessage}>Please log in to view this page</div>
            </div>
            </>
        )
    }

    if (router.isFallback || loading) {
        return <div>Loading...</div>;
    }

    if (!trip) {
        return <div>Error loading trip data</div>;
    }

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    return (
        <>
            <Head>
                <title>{trip.destination}</title>
            </Head>
            <Navbar />
            <div className={styles['trip-details-body']}>
                <main className={styles['trip-details-page']}>
                    <h1 className={styles['trip-title']}>{trip.destination}</h1>
                    <p className={styles['trip-description']}>{trip.description}</p>
                    <div className={styles['trip-details']}>
                        <p><strong>{t('trips.start')}:</strong> {startDate.toDateString()}</p>
                        <p><strong>{t('trips.eind')}:</strong> {endDate.toDateString()}</p>
                        <p className={styles['trip-price']}><strong>{t('trips.prijs')}:</strong> ${trip.price.toFixed(2)}</p>
                    </div>
                </main>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            initialTrip: null,
            ...(await serverSideTranslations(locale ?? 'nl', ['common'])),
        },
    };
};

export default TripDetails;