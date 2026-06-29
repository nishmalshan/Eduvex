// src/pages/user/tutor/TutorApplicationPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyApplication } from '../../redux/features/tutorApplicationSlice';
import TutorApplicationForm from './TutorApplicationForm';
import ApplicationUnderReview from './ApplicationUnderReview';
import Loader from '../common/layout/Loader';
import CourseTable from './dashboard/Coursetable';
import TutorOnboarding from './home/Tutoronboarding';
import { selectOnboardingCompleted } from '../../redux/features/courseSlice';

const TutorApplicationPage = () => {
  const dispatch = useDispatch();
  const { myApplication, hasApplied, loading } = useSelector( (state) => state.tutorApplications );
  const onboardingCompleted = useSelector((state) => state.auth.onboardingCompleted)

  useEffect(() => {
    dispatch(fetchMyApplication());
  }, [dispatch]);

  if (loading || hasApplied === null) return <Loader />;

  if (hasApplied && myApplication && myApplication.status === 'pending') {
    return <ApplicationUnderReview application={myApplication} />;
  } else if (hasApplied && myApplication && myApplication.status === 'rejected') {
    return <TutorApplicationForm />;
  } else if (hasApplied && myApplication && myApplication.status === 'approved') {
    if (!onboardingCompleted) {
      return <TutorOnboarding />;
    } else {
      return <CourseTable />;
    }
  }

  return <TutorApplicationForm />;
};

export default TutorApplicationPage;