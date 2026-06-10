import React, { useState, useEffect, useRef } from 'react';
import './App.scss';

const EMOJI_CATEGORIES = [
    {
        id: 'smileys',
        icon: '😊',
        title: '표정 & 피플',
        emojis: ['😊', '😂', '🥰', '😍', '😎', '🤔', '😢', '😡', '😱', '👍', '👎', '👏', '🙌', '🎉', '❤️', '✨', '🔥', '💩', '👀', '🤝']
    },
    {
        id: 'tasks',
        icon: '📝',
        title: '업무 & 학습',
        emojis: ['📝', '📌', '📅', '⏰', '💻', '💡', '🔑', '📁', '📈', '🚀', '🛠️', '🎯', '📚', '✍️', '✉️', '📞', '💡', '🔔', '🔋', '⚙️']
    },
    {
        id: 'activities',
        icon: '🍕',
        title: '식음 & 활동',
        emojis: ['💧', '☕', '🍺', '🧁', '🍎', '🍲', '🏠', '🚗', '✈️', '🚲', '🛍️', '🎁', '🎈', '📷', '🎨', '🎵', '⚽', '🏆', '🌍', '🍿']
    },
    {
        id: 'symbols',
        icon: '🟢',
        title: '상태 & 기호',
        emojis: ['🟢', '🟡', '🔴', '🔵', '⚪', '⚫', '🏁', '🏳️', '🚩', '🎖️', '🥇', '🥈', '🥉', '🎫', '✅', '❌', '⚠️', '💤', '📢']
    }
];

// 로컬 시간 기준 YYYY-MM-DD 문자열 반환 함수
const getLocalDateString = (date = new Date()) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

// 특정 날짜가 속한 달의 마지막 날짜 문자열 반환 함수
const getLastDayOfMonth = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // 1-based index (e.g. 6 = June)
    const lastDay = new Date(year, month, 0);
    return getLocalDateString(lastDay);
};

function TodoForm({ mode = 'add', selectedDate, itemToEdit, onSave, onCancel }) {
    const [inputValue, setInputValue] = useState(() => {
        return mode === 'edit' && itemToEdit ? itemToEdit.text : '';
    });
    const [itemType, setItemType] = useState(() => {
        return mode === 'edit' && itemToEdit ? itemToEdit.type : 'todo';
    });
    const [selectedEmoji, setSelectedEmoji] = useState(() => {
        return mode === 'edit' && itemToEdit ? itemToEdit.emoji : '😊';
    });
    const [hasDeadline, setHasDeadline] = useState(() => {
        if (mode === 'edit' && itemToEdit && itemToEdit.type === 'routine') {
            const lastDay = getLastDayOfMonth(itemToEdit.startDate);
            return itemToEdit.endDate !== lastDay;
        }
        return false;
    });
    const [endDateValue, setEndDateValue] = useState(() => {
        if (mode === 'edit' && itemToEdit && itemToEdit.endDate) {
            return itemToEdit.endDate;
        }
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return getLocalDateString(d);
    });
    const [alarmTimeValue, setAlarmTimeValue] = useState(() => {
        return mode === 'edit' && itemToEdit && itemToEdit.alarmTime ? itemToEdit.alarmTime : '';
    });

    const [showPicker, setShowPicker] = useState(false);
    const [activeCategory, setActiveCategory] = useState('smileys');

    const pickerRef = useRef(null);
    const triggerRef = useRef(null);

    // const month2 = parseInt(selectedDate.split('-')[1], 10); 
    // const day2 = parseInt(selectedDate.split('-')[2], 10); 


    // 외부 영역 클릭 시 이모지 선택창 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current && !pickerRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)
            ) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPicker]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const data = {
            type: itemType,
            emoji: selectedEmoji,
            text: inputValue,
        };

        if (itemType === 'routine') {
            const calculatedEndDate = hasDeadline ? endDateValue : getLastDayOfMonth(selectedDate);
            data.endDate = calculatedEndDate;
            data.alarmTime = alarmTimeValue || null;
        }

        onSave(data);
    };

    // 투두/루틴 삭제 함수
    const handleDeleteTodo = (e) => {
        e.preventDefault();
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="todo-form-wrapper">
            <form onSubmit={handleSubmit} className="todo-form">
                <div className="todo-form-main">
                    {/* 1. 타입 선택 토글 (수정 모드에서는 타입 변경 차단) */}
                    <div className="todo-type-row">
                        <h2 className="todo-title">
                            <span>{mode === 'edit' ? '일정 수정' : '일정 추가'}</span>
                        </h2>
                        <div className="type-toggle">
                            <button
                                type="button"
                                disabled={mode === 'edit'}
                                onClick={() => setItemType('todo')}
                                className="type-toggle-button" 
                                style={{ cursor: mode === 'edit' ? 'not-allowed' : 'pointer', 
                                    background: itemType === 'todo' ? 'var(--accent, #aa3bff)' : 'transparent', 
                                    color: itemType === 'todo' ? '#fff' : 'var(--text, #6b6375)', 
                                    fontWeight: itemType === 'todo' ? 'bold' : 'normal', 
                                    opacity: mode === 'edit' && itemType !== 'todo' ? 0.5 : 1 }}>
                            할 일
                            </button>
                            <button
                                type="button"
                                disabled={mode === 'edit'}
                                onClick={() => setItemType('routine')}
                                className="type-toggle-button" style={{ cursor: mode === 'edit' ? 'not-allowed' : 'pointer', background: itemType === 'routine' ? 'var(--accent, #aa3bff)' : 'transparent', color: itemType === 'routine' ? '#fff' : 'var(--text, #6b6375)', fontWeight: itemType === 'routine' ? 'bold' : 'normal', opacity: mode === 'edit' && itemType !== 'routine' ? 0.5 : 1 }}
                            >
                                루틴
                            </button>
                        </div>
                    </div>

                    {/* 2. 할 일/루틴 내용 입력 */}
                    <div className="form-row">
                        <label className="form-label">할 일 입력</label>
                        <div className="form-field">
                            {/* 이모지 선택기 */}
                            <div className="emoji-wrap">
                                <button
                                    type="button"
                                    ref={triggerRef}
                                    onClick={() => setShowPicker(!showPicker)}
                                    className="emoji-trigger">
                                    {selectedEmoji}
                                </button>

                                {showPicker && (
                                    <div
                                        ref={pickerRef}
                                        className="emoji-picker">
                                        <div className="emoji-categories-row">
                                            {EMOJI_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setActiveCategory(cat.id)}
                                                    title={cat.title}
                                                    className="emoji-cat-button" 
                                                    style={{ background: activeCategory === cat.id ? 'var(--accent-bg, rgba(170, 59, 255, 0.1))' : 'transparent' }}>
                                                    {cat.icon}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="emoji-category-title">
                                            {EMOJI_CATEGORIES.find(c => c.id === activeCategory).title}
                                        </div>

                                        <div className="emoji-grid">
                                            {EMOJI_CATEGORIES.find(c => c.id === activeCategory).emojis.map((emoji) => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEmoji(emoji);
                                                        setShowPicker(false);
                                                    }}
                                                    className="emoji-button">
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                value={inputValue}
                                disabled={mode === 'edit'}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={itemType === 'todo' ? "할 일을 입력하세요..." : "매일 반복할 루틴을 입력하세요..."}
                                className="todo-input" style={{ background: mode === 'edit' ? 'var(--code-bg, #f4f3ec)' : 'var(--bg, #fff)' }}
                            />
                        </div>
                    </div>

                    {/* 3. 루틴 전용 설정 (기한 종료일 및 알림 시간) */}
                    {itemType === 'routine' && (
                        <>
                            <div className="form-row">
                                <label className="form-label">
                                    마감 기한
                                </label>

                                <div className="form-field-column">
                                    <input
                                        type="date"
                                        value={endDateValue}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setEndDateValue(newValue); // 1. 먼저 날짜 상태를 업데이트하고
                                            
                                            // 2. 핵심: 입력값이 비어있지 않으면(값이 있으면) true, 비어있으면(취소하면) false
                                            setHasDeadline(newValue !== ""); 
                                        }}
                                        className="date-input" />

                                    <span className="hint-text">
                                        지정하지 않으면 이번 달 마지막 날까지 반복
                                    </span>
                                </div>
                            </div>

                            <div className="form-row">
                                <span className="form-label">알림 설정</span>
                                <div className="form-field">
                                    <input
                                        type="time"
                                        value={alarmTimeValue}
                                        onChange={(e) => setAlarmTimeValue(e.target.value)}
                                        className="time-input" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {/* 4. 작업 버튼 */}
                <div className="form-actions">
                    {mode === 'edit' ? (

                        <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className='btn btn-red btn-small'
                        >
                            삭제
                        </button>
                    ) : (
                        
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-cancel">
                        취소
                    </button>
                    )}
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="btn-submit" style={{ opacity: !inputValue.trim() ? 0.5 : 1 }}>
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TodoForm;
