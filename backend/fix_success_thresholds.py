"""
Script to calculate and fix success_threshold values based on number of blanks
in Phase 2 remedial activities
"""
import json
import re

def count_blanks_in_activity(activity):
    """
    Count the success threshold for an activity.
    The threshold is the number of items/questions the student must complete,
    NOT the total number of individual blanks.

    Priority:
    1. correct_answers (if present) - the definitive list of expected responses
    2. pairs (for matching activities)
    3. templates (for gap-fill activities)
    """
    activity_type = activity.get('type', '')

    # PRIORITY 1: Use correct_answers if available (most reliable)
    if 'correct_answers' in activity:
        return len(activity['correct_answers'])

    # PRIORITY 2: For drag_and_drop: count pairs
    elif 'pairs' in activity:
        return len(activity['pairs'])

    # PRIORITY 3: For gap_fill: count templates (each template is one sentence to complete)
    elif 'templates' in activity:
        return len(activity['templates'])

    # PRIORITY 4: For dialogue_completion: count dialogue lines with templates
    elif 'dialogue_lines' in activity:
        return sum(1 for line in activity['dialogue_lines'] if 'template' in line)

    # Additional fallback for other template types
    for key in ['sentences', 'dialogue', 'matching_items', 'report_template',
                'planning_template', 'expansion_exercises', 'research_prompts',
                'reflection_prompts', 'proposal_framework', 'proposal_template',
                'negotiation_dialogue', 'analysis_template', 'story_template',
                'priority_framework']:
        if key in activity:
            if isinstance(activity[key], list):
                return len(activity[key])
            elif key == 'matching_items':
                return len(activity[key])

    return 0

def analyze_phase2_data():
    """Analyze all activities and show current vs correct thresholds"""
    from models.phase2_loader import PHASE_2_REMEDIAL_ACTIVITIES

    print("=" * 80)
    print("PHASE 2 REMEDIAL ACTIVITIES - SUCCESS THRESHOLD ANALYSIS")
    print("=" * 80)

    issues_found = []

    for step_id, levels in PHASE_2_REMEDIAL_ACTIVITIES.items():
        print(f"\n{'='*80}")
        print(f"STEP: {step_id.upper()}")
        print(f"{'='*80}")

        for level, activities in levels.items():
            print(f"\n  Level: {level}")
            print(f"  {'-'*76}")

            for i, activity in enumerate(activities):
                activity_id = activity.get('id', 'unknown')
                current_threshold = activity.get('success_threshold', 'NOT SET')

                # Calculate correct threshold
                blank_count = count_blanks_in_activity(activity)
                correct_threshold = blank_count

                # Check if there's a mismatch
                is_correct = current_threshold == correct_threshold
                status = "[OK]" if is_correct else "[ERROR]"

                print(f"    Activity {i+1}: {activity_id}")
                print(f"      Current threshold: {current_threshold}")
                print(f"      Correct threshold: {correct_threshold} (items: {blank_count})")
                print(f"      Status: {status}")

                if not is_correct:
                    issues_found.append({
                        'step': step_id,
                        'level': level,
                        'activity_index': i,
                        'activity_id': activity_id,
                        'current': current_threshold,
                        'correct': correct_threshold
                    })

    print(f"\n{'='*80}")
    print(f"SUMMARY")
    print(f"{'='*80}")
    print(f"Total issues found: {len(issues_found)}")

    if issues_found:
        print("\nActivities that need fixing:")
        for issue in issues_found:
            print(f"  - {issue['step']}/{issue['level']}/{issue['activity_id']}: "
                  f"{issue['current']} -> {issue['correct']}")
    else:
        print("\n[OK] All success_threshold values are correct!")

    return issues_found

if __name__ == "__main__":
    analyze_phase2_data()
