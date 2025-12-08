"""
Adaptive Learning Service
Tracks performance and adjusts difficulty dynamically
"""

import sqlite3
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import deque

# Performance thresholds
SUCCESS_THRESHOLD = 0.8  # 80% success rate = too easy
FAILURE_THRESHOLD = 0.4  # 40% success rate = too hard
WINDOW_SIZE = 5  # Track last 5 activities

# Spaced repetition intervals (in days)
REVIEW_INTERVALS = [1, 3, 7, 14, 30]
MASTERY_THRESHOLD = 0.95


class AdaptiveService:
    """Service for adaptive learning and spaced repetition"""
    
    def __init__(self, db_path='instance/fardi.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def track_performance(self, user_id: int, activity_id: str, 
                         success: bool, score: float, activity_type: str = "remedial") -> Dict:
        """
        Track user performance on an activity
        Returns: performance analysis and recommendations
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Get existing performance data
            cursor.execute('''
                SELECT attempts, success_rate, mastery_level
                FROM performance_tracking
                WHERE user_id = ? AND activity_id = ?
            ''', (user_id, activity_id))
            
            existing = cursor.fetchone()
            
            if existing:
                attempts = existing['attempts'] + 1
                # Update success rate (weighted average)
                old_success_rate = existing['success_rate']
                new_success_rate = (old_success_rate * existing['attempts'] + (1.0 if success else 0.0)) / attempts
                
                # Update mastery level
                mastery_level = min(1.0, new_success_rate * (1 + (attempts * 0.1)))
                
                cursor.execute('''
                    UPDATE performance_tracking
                    SET attempts = ?, success_rate = ?, mastery_level = ?, last_attempt = CURRENT_TIMESTAMP
                    WHERE user_id = ? AND activity_id = ?
                ''', (attempts, new_success_rate, mastery_level, user_id, activity_id))
            else:
                attempts = 1
                new_success_rate = 1.0 if success else 0.0
                mastery_level = new_success_rate
                
                cursor.execute('''
                    INSERT INTO performance_tracking 
                    (user_id, activity_id, activity_type, success_rate, attempts, mastery_level)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (user_id, activity_id, activity_type, new_success_rate, attempts, mastery_level))
            
            # Update spaced repetition schedule
            self._update_spaced_repetition(cursor, user_id, activity_id, success, attempts)
            
            conn.commit()
            
            # Get recommendations
            recommendations = self._get_recommendations(user_id, activity_type)
            
            return {
                "success_rate": round(new_success_rate, 2),
                "attempts": attempts,
                "mastery_level": round(mastery_level, 2),
                "recommendations": recommendations
            }
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def _update_spaced_repetition(self, cursor, user_id: int, activity_id: str, 
                                  success: bool, attempts: int):
        """Update spaced repetition schedule"""
        cursor.execute('''
            SELECT review_count, ease_factor, interval_days
            FROM spaced_repetition
            WHERE user_id = ? AND activity_id = ?
        ''', (user_id, activity_id))
        
        existing = cursor.fetchone()
        
        if existing:
            review_count = existing['review_count'] + 1
            ease_factor = existing['ease_factor']
            interval_days = existing['interval_days']
            
            # Adjust ease factor based on performance
            if success:
                ease_factor = min(3.0, ease_factor + 0.1)
                # Move to next interval
                interval_index = min(review_count, len(REVIEW_INTERVALS) - 1)
                interval_days = REVIEW_INTERVALS[interval_index]
            else:
                ease_factor = max(1.3, ease_factor - 0.2)
                # Reset to first interval
                interval_days = REVIEW_INTERVALS[0]
                review_count = 0
            
            next_review = datetime.now() + timedelta(days=interval_days)
            
            cursor.execute('''
                UPDATE spaced_repetition
                SET review_count = ?, ease_factor = ?, interval_days = ?, next_review_date = ?
                WHERE user_id = ? AND activity_id = ?
            ''', (review_count, ease_factor, interval_days, next_review.date(), user_id, activity_id))
        else:
            # First review
            next_review = datetime.now() + timedelta(days=REVIEW_INTERVALS[0])
            
            cursor.execute('''
                INSERT INTO spaced_repetition 
                (user_id, activity_id, review_count, ease_factor, interval_days, next_review_date)
                VALUES (?, ?, 0, 2.5, ?, ?)
            ''', (user_id, activity_id, REVIEW_INTERVALS[0], next_review.date()))
    
    def _get_recommendations(self, user_id: int, activity_type: str) -> Dict:
        """Get difficulty recommendations based on recent performance"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get last 5 activities
        cursor.execute('''
            SELECT success_rate, mastery_level
            FROM performance_tracking
            WHERE user_id = ? AND activity_type = ?
            ORDER BY last_attempt DESC
            LIMIT ?
        ''', (user_id, activity_type, WINDOW_SIZE))
        
        recent_performance = cursor.fetchall()
        conn.close()
        
        if len(recent_performance) < 3:
            return {
                "adjustment": "maintain",
                "reason": "Insufficient data",
                "confidence": "low"
            }
        
        # Calculate average success rate
        avg_success_rate = sum(row['success_rate'] for row in recent_performance) / len(recent_performance)
        avg_mastery = sum(row['mastery_level'] for row in recent_performance) / len(recent_performance)
        
        if avg_success_rate >= SUCCESS_THRESHOLD:
            return {
                "adjustment": "increase_difficulty",
                "reason": f"High success rate ({avg_success_rate:.0%})",
                "confidence": "high",
                "suggestion": "Skip easier remedials or advance to next level"
            }
        elif avg_success_rate <= FAILURE_THRESHOLD:
            return {
                "adjustment": "decrease_difficulty",
                "reason": f"Low success rate ({avg_success_rate:.0%})",
                "confidence": "high",
                "suggestion": "Provide additional support materials or easier activities"
            }
        else:
            return {
                "adjustment": "maintain",
                "reason": f"Appropriate difficulty ({avg_success_rate:.0%})",
                "confidence": "medium",
                "suggestion": "Continue current difficulty level"
            }
    
    def get_activities_for_review(self, user_id: int) -> List[Dict]:
        """Get activities that are due for review (spaced repetition)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        today = datetime.now().date()
        
        cursor.execute('''
            SELECT 
                sr.activity_id,
                sr.next_review_date,
                sr.review_count,
                sr.interval_days,
                pt.mastery_level
            FROM spaced_repetition sr
            JOIN performance_tracking pt ON sr.user_id = pt.user_id AND sr.activity_id = pt.activity_id
            WHERE sr.user_id = ? AND sr.next_review_date <= ?
            AND pt.mastery_level < ?
            ORDER BY sr.next_review_date ASC
            LIMIT 10
        ''', (user_id, today, MASTERY_THRESHOLD))
        
        activities = []
        for row in cursor.fetchall():
            activities.append({
                "activity_id": row['activity_id'],
                "next_review_date": row['next_review_date'],
                "review_count": row['review_count'],
                "interval_days": row['interval_days'],
                "mastery_level": round(row['mastery_level'], 2)
            })
        
        conn.close()
        return activities
    
    def get_performance_summary(self, user_id: int) -> Dict:
        """Get overall performance summary"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(*) as total_activities,
                AVG(success_rate) as avg_success_rate,
                AVG(mastery_level) as avg_mastery,
                SUM(CASE WHEN mastery_level >= ? THEN 1 ELSE 0 END) as mastered_count
            FROM performance_tracking
            WHERE user_id = ?
        ''', (MASTERY_THRESHOLD, user_id))
        
        result = cursor.fetchone()
        conn.close()
        
        return {
            "total_activities": result['total_activities'] or 0,
            "avg_success_rate": round(result['avg_success_rate'] or 0, 2),
            "avg_mastery": round(result['avg_mastery'] or 0, 2),
            "mastered_count": result['mastered_count'] or 0,
            "mastery_percentage": round((result['mastered_count'] / result['total_activities'] * 100) if result['total_activities'] > 0 else 0, 1)
        }
