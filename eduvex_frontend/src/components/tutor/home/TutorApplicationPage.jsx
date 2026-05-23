// src/pages/user/tutor/TutorApplicationPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplication } from '../../../redux/features/tutorApplicationSlice';
import TutorApplicationForm from '../../../components/tutor/TutorApplicationForm';
import ApplicationUnderReview from '../../../components/common/layout/ApplicationUnderReview';
import Loader from '../../../components/common/layout/Loader';

const TutorApplicationPage = () => {
  const dispatch = useDispatch();
  const { myApplication, hasApplied, loading } = useSelector(
    (state) => state.tutorApplications
  );

  useEffect(() => {
    dispatch(fetchMyApplication());
  }, [dispatch]);

  if (loading || hasApplied === null) return <Loader />;

  if (hasApplied && myApplication) {
    return <ApplicationUnderReview application={myApplication} />;
  }

  return <TutorApplicationForm />;
};

export default TutorApplicationPage;