"""
Auto-fix success_threshold values in phase2_data.py
"""
import re

# Mapping of activity IDs to correct thresholds
CORRECTIONS = {
    'role_story_builder': 15,
    'cultural_role_dialogue': 8,
    'role_reflection_writing': 15,
    'roleplay_dialogue_practice': 8,
    'sentence_expansion_challenge': 10,
    'cultural_role_reflection': 5,  # step_1/B1
    'schedule_sentence_builder': 7,
    'schedule_dialogue_practice': 7,
    'meeting_purpose_writing': 12,
    'meeting_cultural_research': 4,
    'schedule_team_coordination': 7,
    'cultural_meeting_reflection': 5,  # step_2/B1
    'task_listening_dialogue': 8,
    'task_list_writing': 10,
    'plan_listening_dialogue_completion': 11,
    'plan_listening_story_writing': 10,
    'plan_listening_proposal_writing': 10,  # Needs manual check - found 0 blanks
    'plan_listening_roleplay_dialogue': 7,
    'plan_listening_sentence_expansion': 5,
    'plan_listening_negotiation_roleplay': 3,
}

def fix_phase2_data():
    """Apply fixes to phase2_data.py"""
    file_path = 'models/phase2_data.py'

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    fixes_applied = []

    for activity_id, correct_threshold in CORRECTIONS.items():
        # Pattern to match: "id": "activity_id", ... "success_threshold": X,
        # We need to find the activity block and replace its threshold
        pattern = rf'"id":\s*"{activity_id}"'

        # Find all occurrences of this activity
        matches = list(re.finditer(pattern, content))

        for match in matches:
            # Find the success_threshold in the same activity block
            # Search forward from the match position for the next success_threshold
            start_pos = match.start()

            # Find the end of this activity (next activity or end of list)
            next_activity = content.find('"id":', start_pos + 10)
            if next_activity == -1:
                next_activity = len(content)

            activity_block = content[start_pos:next_activity]

            # Find success_threshold in this block
            threshold_pattern = r'"success_threshold":\s*\d+'
            threshold_match = re.search(threshold_pattern, activity_block)

            if threshold_match:
                old_threshold_str = threshold_match.group(0)
                old_threshold = int(re.search(r'\d+', old_threshold_str).group(0))

                new_threshold_str = f'"success_threshold": {correct_threshold}'

                # Replace in the content
                full_old_str = content[start_pos:start_pos + len(activity_block)]
                full_new_str = full_old_str.replace(old_threshold_str, new_threshold_str)

                content = content[:start_pos] + full_new_str + content[start_pos + len(activity_block):]

                fixes_applied.append({
                    'activity_id': activity_id,
                    'old': old_threshold,
                    'new': correct_threshold
                })
                print(f"Fixed {activity_id}: {old_threshold} -> {correct_threshold}")

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n{len(fixes_applied)} fixes applied successfully!")
    return fixes_applied

if __name__ == "__main__":
    fix_phase2_data()
