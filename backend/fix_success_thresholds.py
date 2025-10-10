"""
Script to calculate and fix success_threshold values based on number of blanks
in Phase 2 remedial activities
"""
import json
import re

def count_blanks_in_activity(activity):
    """Count total number of blanks in an activity"""
    total_blanks = 0

    # Count blanks in sentences (fill_gaps activities)
    if 'sentences' in activity:
        for sentence in activity['sentences']:
            if isinstance(sentence, dict) and 'blanks' in sentence:
                total_blanks += len(sentence['blanks'])

    # Count blanks in dialogue
    if 'dialogue' in activity:
        for dialogue_item in activity['dialogue']:
            if isinstance(dialogue_item, dict) and 'blanks' in dialogue_item:
                total_blanks += len(dialogue_item['blanks'])

    # Count blanks in matching_items
    if 'matching_items' in activity:
        total_blanks = len(activity['matching_items'])

    # Count blanks in other template types
    for key in ['report_template', 'planning_template', 'expansion_exercises',
                'research_prompts', 'reflection_prompts', 'proposal_framework',
                'proposal_template', 'negotiation_dialogue', 'analysis_template',
                'story_template', 'priority_framework']:
        if key in activity:
            for item in activity[key]:
                if isinstance(item, dict) and 'blanks' in item:
                    total_blanks += len(item['blanks'])

    return total_blanks

def analyze_phase2_data():
    """Analyze all activities and show current vs correct thresholds"""
    from models.phase2_data import PHASE_2_REMEDIAL_ACTIVITIES

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
                print(f"      Correct threshold: {correct_threshold} (blanks: {blank_count})")
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
