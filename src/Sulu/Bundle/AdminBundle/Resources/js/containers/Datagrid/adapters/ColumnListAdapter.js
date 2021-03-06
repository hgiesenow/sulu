// @flow
import React from 'react';
import {observer} from 'mobx-react';
import ColumnList from '../../../components/ColumnList';
import GhostIndicator from '../../../components/GhostIndicator';
import PublishIndicator from '../../../components/PublishIndicator';
import {translate} from '../../../utils/Translator';
import FullLoadingStrategy from '../loadingStrategies/FullLoadingStrategy';
import ColumnStructureStrategy from '../structureStrategies/ColumnStructureStrategy';
import AbstractAdapter from './AbstractAdapter';
import columnListAdapterStyles from './columnListAdapter.scss';

@observer
export default class ColumnListAdapter extends AbstractAdapter {
    static LoadingStrategy = FullLoadingStrategy;

    static StructureStrategy = ColumnStructureStrategy;

    static icon = 'su-columns';

    static defaultProps = {
        data: [],
    };

    handleItemClick = (id: string | number) => {
        const {onItemActivation} = this.props;
        if (onItemActivation) {
            onItemActivation(id);
        }
    };

    handleItemSelectionChange = (id: string | number) => {
        const {onItemSelectionChange, selections} = this.props;
        if (onItemSelectionChange) {
            onItemSelectionChange(id, !selections.includes(id));
        }
    };

    handleColumnAdd = (index?: string | number) => {
        if (!index || typeof index !== 'number') {
            return;
        }

        const {activeItems, onAddClick} = this.props;

        if (onAddClick && activeItems && activeItems[index]) {
            onAddClick(activeItems[index]);
        }
    };

    render() {
        const {
            activeItems,
            disabledIds,
            loading,
            onAddClick,
            onDeleteClick,
            onItemClick,
            onItemSelectionChange,
            selections,
        } = this.props;

        const buttons = [];
        const ghostButtons = [];

        if (onItemClick) {
            buttons.push({
                icon: 'su-pen',
                onClick: onItemClick,
            });
            ghostButtons.push({
                icon: 'su-plus-circle',
                onClick: onItemClick,
            });
        }

        if (onItemSelectionChange) {
            const checkButton = {
                icon: 'su-check',
                onClick: this.handleItemSelectionChange,
            };
            buttons.push(checkButton);
            ghostButtons.push(checkButton);
        }

        const toolbarItems = [];

        if (onAddClick) {
            toolbarItems.push({
                icon: 'su-plus-circle',
                type: 'button',
                onClick: this.handleColumnAdd,
            });
        }

        if (!activeItems) {
            throw new Error(
                'The ColumnListAdapter does not work without activeItems. '
                + 'This error should not happen and is likely a bug.'
            );
        }

        const settingOptions = [];
        if (onDeleteClick) {
            settingOptions.push({
                isDisabled: (index) => {
                    return activeItems[((index + 1: any): number)] === undefined;
                },
                label: translate('sulu_admin.delete'),
                onClick: (index) => {
                    onDeleteClick(activeItems[((index + 1: any): number)]);
                },
            });
        }

        if (settingOptions.length > 0) {
            toolbarItems.push({
                icon: 'su-cog',
                type: 'dropdown',
                options: settingOptions,
            });
        }

        return (
            <div className={columnListAdapterStyles.columnListAdapter}>
                <ColumnList onItemClick={this.handleItemClick} toolbarItems={toolbarItems}>
                    {this.props.data.map((items, index) => (
                        <ColumnList.Column
                            key={index}
                            loading={index >= this.props.data.length - 1 && loading}
                        >
                            {items.map((item: Object) => (
                                // TODO: Don't access hasChildren, published, publishedState, title or type directly
                                <ColumnList.Item
                                    active={activeItems ? activeItems.includes(item.id) : undefined}
                                    buttons={item.type && item.type.name === 'ghost' ? ghostButtons : buttons}
                                    disabled={disabledIds.includes(item.id)}
                                    hasChildren={item.hasChildren}
                                    id={item.id}
                                    indicators={item.type && item.type.name === 'ghost'
                                        ? [
                                            <GhostIndicator key={'ghost'} locale={item.type.value} />,
                                        ]
                                        : [
                                            <PublishIndicator
                                                key={'publish'}
                                                draft={item.publishedState === undefined ? false : !item.publishedState}
                                                published={item.publishedState === undefined ? false : item.published}
                                            />,
                                        ]
                                    }
                                    key={item.id}
                                    selected={selections.includes(item.id)}
                                >
                                    {item.title}
                                </ColumnList.Item>
                            ))}
                        </ColumnList.Column>
                    ))}
                </ColumnList>
            </div>
        );
    }
}
